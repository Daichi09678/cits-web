const { test } = require("node:test");
const assert = require("node:assert/strict");
const { NextResponse } = require("next/server");
const { load } = require("./helpers/load.cjs");

const consultation = load("lib/consultation.ts", {}, { URLSearchParams });
const http = load("lib/http.ts", { "next/server": { NextResponse } });
const serviceCatalog = load("lib/serviceCatalog.ts", { "@/data/serviceDetails": load("data/serviceDetails.ts") });
const product = {
  id: "catalog-app",
  name: "Aplikasi Aset & Inventaris",
  description: "Mengelola inventaris",
  features: ["Pelacakan aset", "Laporan aset"],
  tags: ["Web"],
  isActive: true,
};
const service = {
  id: "pillar-2",
  title: "Konsultan TI",
  desc: "Pendampingan kebutuhan TI",
  features: ["Audit kesiapan"],
  sla: "Sesuai kesepakatan",
  isActive: true,
};
const message = {
  name: "QA",
  company: "Test",
  email: "qa@example.test",
  phone: "08123456789",
  message: "Konsultasi aplikasi",
  serviceRequested: "Software House",
};
const request = (body) =>
  new Request("http://localhost/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

function route(db) {
  return load("app/api/messages/route.ts", {
    "next/server": { NextResponse },
    "@/lib/apiAuth": {},
    "@/lib/http": http,
    "@/lib/consultation": consultation,
    "@/lib/serviceCatalog": serviceCatalog,
    "@/lib/db": {
      DbRepo: { getContactInfo: async () => ({ email: "qa@example.test" }), getServices: async () => [], ...db },
    },
    "@/config/inbox": {},
    "@/lib/email": { sendContactNotificationEmail: async () => ({ sent: false }) },
  });
}

test("consultation links round-trip service and product identifiers with reserved characters", () => {
  const service = "Konsultan TI & SPBE / Pengadaan";
  const productId = "app / aset?#";
  const url = new URL(consultation.consultationHref({ service, productId }), "http://localhost");
  assert.equal(url.pathname, "/contact");
  assert.equal(url.searchParams.get("service"), service);
  assert.equal(url.searchParams.get("product"), productId);
  assert.equal(url.hash, "#consultation-form");
});

test("consultation links preserve purpose and chosen feature descriptions", () => {
  const url = new URL(
    consultation.consultationHref({
      productId: product.id,
      purpose: "quotation",
      features: ["Pelacakan aset", "API & integrasi / ERP"],
    }),
    "http://localhost"
  );
  assert.equal(url.searchParams.get("purpose"), "quotation");
  assert.deepEqual(url.searchParams.getAll("feature"), ["Pelacakan aset", "API & integrasi / ERP"]);
  assert.equal(consultation.consultationPurpose("unknown"), "discussion");
});

test("consultation links carry page origin and a portfolio reference without losing selected purpose", () => {
  for (const source of ["home", "products", "services", "portfolio", "about"]) {
    const url = new URL(
      consultation.consultationHref({ source, referenceId: "proyek / TI & API", purpose: "demo" }),
      "http://localhost"
    );
    assert.equal(url.searchParams.get("source"), source);
    assert.equal(url.searchParams.get("reference"), "proyek / TI & API");
    assert.equal(url.searchParams.get("purpose"), "demo");
    assert.equal(consultation.consultationSource(source), source);
  }
  assert.equal(consultation.consultationSource("unknown"), "contact");
});

test("portfolio consultations save the verified project snapshot and visitor intent", async () => {
  let saved;
  const project = {
    id: "reference-project",
    title: "Portal Data",
    client: "Instansi",
    servicePillar: "Software House",
    challenge: "Data terpisah",
    solution: "Integrasi data",
    scopeOfWork: ["API dan dashboard"],
    isActive: true,
  };
  const api = route({
    getPortfolio: async () => [project],
    addMessage: async (body) => {
      saved = body;
      return { ...body, id: "saved" };
    },
  });
  assert.equal(
    (
      await api.POST(
        request({
          ...message,
          consultation: {
            source: "portfolio",
            referenceId: project.id,
            purpose: "discussion",
            portfolio: { title: "Forged title" },
            expectedOutcome: "Portal terpadu untuk instansi kami",
          },
        })
      )
    ).status,
    201
  );
  assert.equal(saved.consultation.source, "portfolio");
  assert.equal(saved.consultation.referenceId, project.id);
  assert.equal(saved.consultation.portfolio.title, project.title);
  assert.equal(saved.consultation.portfolio.solution, project.solution);
  assert.deepEqual(Array.from(saved.consultation.portfolio.scopeOfWork), project.scopeOfWork);
  assert.equal(saved.consultation.expectedOutcome, "Portal terpadu untuk instansi kami");
  assert.ok(consultation.consultationSummary(saved).includes(project.title));
  for (const record of [[], [{ ...project, isActive: false }]]) {
    const invalidApi = route({
      getPortfolio: async () => record,
      addMessage: async () => assert.fail("Unavailable reference was saved"),
    });
    assert.equal(
      (await invalidApi.POST(request({ ...message, consultation: { referenceId: project.id } }))).status,
      400
    );
  }
});

test("service presentation follows catalog edits and remains stable after reordering", () => {
  const resolved = serviceCatalog.resolveServiceCatalog([
    { ...service, id: "pillar-3" },
    { ...service, isActive: false },
    service,
  ]);
  assert.equal(resolved.length, 2);
  assert.equal(resolved[0].id, "it-supplier");
  assert.equal(resolved[1].id, "it-consultant");
  assert.equal(resolved[1].description, service.desc);
  assert.deepEqual(Array.from(resolved[1].features), service.features);
  assert.ok(resolved[1].techStack.includes("TOGAF Framework"));
});

test("structured requirements reject malformed or excessive values before writing", async () => {
  const api = route({ addMessage: async () => assert.fail("Invalid details were saved") });
  for (const detail of [
    { source: "unknown" },
    { source: {} },
    { referenceId: {} },
    { referenceId: "x".repeat(201) },
    null,
    [],
    { purpose: "invalid" },
    { expectedOutcome: {} },
    { timeline: "x".repeat(201) },
    { requestedFeatures: [4] },
    { requestedFeatures: Array(21).fill("feature") },
  ]) {
    assert.equal((await api.POST(request({ ...message, consultation: detail }))).status, 400);
  }
});

test("requirements retain visitor intent and use verified catalog snapshots instead of supplied snapshots", async () => {
  let saved;
  const api = route({
    getProductById: async () => product,
    getServices: async () => [service],
    addMessage: async (body) => {
      saved = body;
      return { ...body, id: "saved" };
    },
  });
  const requirements = {
    purpose: "demo",
    requestedFeatures: [product.features[0], service.features[0]],
    expectedOutcome: " Mempercepat pencarian aset ",
    currentSystem: "Excel",
    timeline: "3 bulan",
    usageEstimate: "20 pengguna",
    product: { name: "Forged" },
    service: { title: "Forged" },
  };
  assert.equal(
    (
      await api.POST(
        request({ ...message, serviceRequested: service.title, productId: product.id, consultation: requirements })
      )
    ).status,
    201
  );
  assert.equal(saved.consultation.expectedOutcome, "Mempercepat pencarian aset");
  assert.equal(saved.consultation.purpose, "demo");
  assert.equal(saved.consultation.currentSystem, "Excel");
  assert.equal(saved.consultation.product.name, product.name);
  assert.equal(saved.consultation.product.description, product.description);
  assert.equal(saved.consultation.service.title, service.title);
  assert.equal(saved.consultation.service.description, service.desc);
  assert.deepEqual(Array.from(saved.consultation.requestedFeatures), requirements.requestedFeatures);
  assert.equal(
    (
      await api.POST(
        request({ ...message, productId: product.id, consultation: { requestedFeatures: ["Nonexistent feature"] } })
      )
    ).status,
    400
  );
});

test("inbox consultation summaries include both selections and remain compatible with old messages", () => {
  assert.equal(
    consultation.consultationSummary({ serviceRequested: "Software House", productRequested: product.name }),
    `Software House | ${product.name}`
  );
  assert.equal(consultation.consultationSummary({ serviceRequested: "Konsultan TI" }), "Konsultan TI");
  assert.equal(consultation.consultationSummary({ productRequested: product.name }), product.name);
  assert.equal(consultation.consultationSummary({}), "Konsultasi Umum");
});

test("notification emails include visitor requirements and escape visitor content", async () => {
  let email;
  const mailer = load(
    "lib/email.ts",
    {
      nodemailer: {
        default: {
          createTransport: () => ({
            sendMail: async (value) => {
              email = value;
            },
          }),
        },
      },
      "@/lib/consultation": consultation,
    },
    {
      process: { env: { SMTP_HOST: "smtp.example.test", SMTP_USER: "qa@example.test", SMTP_PASS: "fixture-only" } },
      console: { log() {}, error() {} },
    }
  );
  const result = await mailer.sendContactNotificationEmail({
    ...message,
    name: "<b>QA</b>",
    message: "<script>unsafe</script>",
    productRequested: product.name,
    consultation: {
      purpose: "quotation",
      expectedOutcome: "Akses <aman>",
      currentSystem: "Excel",
      timeline: "3 bulan",
      usageEstimate: "20 pengguna",
      requestedFeatures: [product.features[0]],
    },
  });
  assert.equal(result.sent, true);
  for (const text of [
    "Permintaan Penawaran",
    "Akses &lt;aman&gt;",
    "Excel",
    "3 bulan",
    "20 pengguna",
    product.features[0],
    "Aplikasi Aset &amp; Inventaris",
    "&lt;b&gt;QA&lt;/b&gt;",
    "&lt;script&gt;unsafe&lt;/script&gt;",
  ])
    assert.ok(email.html.includes(text), text);
  assert.ok(!email.html.includes("<script>unsafe</script>"));
});

test("product consultation stores the verified catalog name together with the chosen service", async () => {
  let saved;
  const api = route({
    getProductById: async (id) => {
      assert.equal(id, product.id);
      return product;
    },
    addMessage: async (body) => {
      saved = body;
      return { ...body, id: "saved" };
    },
  });
  const response = await api.POST(
    request({ ...message, productId: product.id, productRequested: "Forged catalog name" })
  );
  assert.equal(response.status, 201);
  assert.equal(saved.serviceRequested, "Software House");
  assert.equal(saved.productId, product.id);
  assert.equal(saved.productRequested, product.name);
  const body = await response.json();
  assert.equal(body.data.productRequested, product.name);
});

test("product-only consultations get an explicit product consultation label", async () => {
  let saved;
  const api = route({
    getProductById: async () => product,
    addMessage: async (body) => {
      saved = body;
      return { ...body, id: "saved" };
    },
  });
  assert.equal((await api.POST(request({ ...message, serviceRequested: "", productId: product.id }))).status, 201);
  assert.equal(saved.serviceRequested, "Konsultasi Produk");
});

test("unavailable, inactive or malformed product selections never save a message", async () => {
  for (const record of [null, { ...product, isActive: false }]) {
    const api = route({
      getProductById: async () => record,
      addMessage: async () => assert.fail("Invalid selection was saved"),
    });
    assert.equal((await api.POST(request({ ...message, productId: "not-available" }))).status, 400);
  }
  const api = route({ addMessage: async () => assert.fail("Invalid selection was saved") });
  for (const productId of [123, {}, "x".repeat(201)]) {
    assert.equal((await api.POST(request({ ...message, productId }))).status, 400);
  }
});

test("product selection survives repository storage and reads, including migration of an already initialized process", async () => {
  const migrations = [];
  const inserts = [];
  const row = {
    id: "saved",
    ...message,
    service_requested: message.serviceRequested,
    product_id: product.id,
    product_requested: product.name,
    consultation_details: {
      purpose: "quotation",
      expectedOutcome: "Mempercepat pencarian aset",
      requestedFeatures: ["Pelacakan aset"],
      product: { ...product, name: "Nama Saat Pesan Dikirim" },
    },
    status: "unread",
    created_at: new Date().toISOString(),
  };
  const sql = Object.assign(
    async (strings, ...values) => {
      const query = strings.join("?");
      if (query.includes("INSERT INTO contact_messages")) inserts.push({ query, values });
      return query.includes("FROM contact_messages") ? [row] : [];
    },
    {
      json: (value) => value,
      unsafe: async (statement) => {
        migrations.push(statement);
      },
    }
  );
  const { DbRepo } = load(
    "lib/db.ts",
    {
      postgres: { default: () => sql },
      "@/data/initialData": new Proxy({}, { get: () => [] }),
      "@/config/inbox": { getMessageRetentionDays: () => 30 },
    },
    {
      process: { env: { DATABASE_URL: "postgres://localhost/test" } },
      _citsDbInitialized: true,
      _citsDbSchemaVersion: 1,
    }
  );
  await DbRepo.addMessage({
    ...message,
    productId: product.id,
    productRequested: product.name,
    consultation: row.consultation_details,
  });
  assert.ok(migrations.some((statement) => statement.includes("ADD COLUMN IF NOT EXISTS product_requested")));
  assert.ok(inserts[0].query.includes("product_id, product_requested"));
  assert.ok(inserts[0].values.includes(product.id));
  assert.ok(inserts[0].values.includes(product.name));
  assert.ok(inserts[0].values.some((value) => value?.expectedOutcome === row.consultation_details.expectedOutcome));
  const messages = await DbRepo.getMessages();
  assert.equal(messages[0].productId, product.id);
  assert.equal(messages[0].productRequested, product.name);
  assert.equal(messages[0].serviceRequested, message.serviceRequested);
  assert.equal(messages[0].consultation.expectedOutcome, row.consultation_details.expectedOutcome);
  assert.equal(messages[0].consultation.product.name, "Nama Saat Pesan Dikirim");
  assert.deepEqual(Array.from(messages[0].consultation.requestedFeatures), ["Pelacakan aset"]);
});
