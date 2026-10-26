const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");

const access = load("lib/internalAccess.ts");
const internal = { role: "Admin Internal", pageAccess: ["products"] };
const superadmin = { role: "Super Admin" };
const products = [{ id: "p-1", name: "Produk contoh", category: "Web", description: "Detail produk", isActive: true }];
const messages = [{ id: "m-1", name: "Pengunjung", message: "Pesan privat", status: "unread" }];

function render(relative, { user = internal, pathname = "/admin", loading = false, children } = {}) {
  const redirects = [];
  const effects = [];
  const noop = () => {};
  const component = load(relative, {
    react: { ...React, useEffect: (callback) => effects.push(callback) },
    "react/jsx-runtime": require("react/jsx-runtime"),
    "next/link": { default: ({ children, ...props }) => React.createElement("a", props, children) },
    "next/image": { default: ({ src, alt }) => React.createElement("img", { src, alt }) },
    "next/navigation": { usePathname: () => pathname, useRouter: () => ({ replace: (url) => redirects.push(url) }) },
    "lucide-react": require("lucide-react"),
    "@/lib/auth": { useAdminAuth: () => ({ session: user ? { user } : null, loading, logout: noop }) },
    "@/lib/internalAccess": access,
    "@/stores/citsStore": {
      useCitsStore: () => ({ products, messages, clients: [], caseStudies: [], actions: {} }),
    },
    "@/components/admin/AdminShell": { useAdminShell: () => ({ closeMobile: noop }) },
    "@/components/admin/AdminTopbar": { default: () => null },
    "@/components/admin/UserAvatar": { default: () => null },
    "@/components/admin/MetricCard": { default: ({ title }) => React.createElement("p", null, title) },
  }).default;
  const html = renderToStaticMarkup(React.createElement(component, null, children));
  for (const effect of effects) effect();
  return { html, redirects };
}

function sidebarLinks(user) {
  const { html } = render("components/admin/AdminSidebar.tsx", { user });
  const links = [...new Set([...html.matchAll(/href="(\/admin[^\"]*)"/g)].map((match) => match[1]))];
  return { html, links };
}

test("sidebar shows only assigned pages while keeping dashboard and settings", () => {
  const { html, links } = sidebarLinks(internal);
  assert.deepEqual(links, ["/admin", "/admin/products", "/admin/settings"]);
  assert.doesNotMatch(html, /Informasi Perusahaan|Layanan CITS|Portofolio Kami|Hubungi Kami/);
  assert.match(html, /Produk &amp; Layanan/);
  assert.doesNotMatch(html, /Hanya dapat dilihat/);
});

test("empty or missing internal permissions hide content pages and empty sidebar groups", () => {
  for (const user of [{ role: "Admin Internal", pageAccess: [] }, { role: "Admin Internal" }]) {
    const { html, links } = sidebarLinks(user);
    assert.deepEqual(links, ["/admin", "/admin/settings"]);
    assert.doesNotMatch(html, /Produk &amp; Layanan|Informasi Perusahaan/);
    assert.match(html, /Pengaturan/);
  }
  assert.deepEqual(sidebarLinks(null).links, ["/admin"]); // Only the brand link renders before authentication.
});

test("superadmin retains every sidebar page without explicit page assignments", () => {
  const { links } = sidebarLinks(superadmin);
  assert.equal(links.length, access.EDITABLE_PAGES.length + 2);
  for (const page of access.EDITABLE_PAGES) assert.ok(links.includes(page.href));
});

test("direct URLs to unassigned pages redirect without mounting their content", () => {
  const ForbiddenContent = () => assert.fail("Unassigned content must not mount");
  const deniedPaths = access.EDITABLE_PAGES.filter((page) => page.key !== "products").map((page) => page.href);
  deniedPaths.push("/admin/landing", "/admin/landing/detail", "/admin/services/detail");
  for (const pathname of deniedPaths) {
    const { html, redirects } = render("components/admin/PageAccessGate.tsx", {
      pathname,
      children: React.createElement(ForbiddenContent),
    });
    assert.deepEqual(redirects, ["/admin"], pathname);
    assert.match(html, /Mengalihkan ke dashboard/);
  }
});

test("assigned pages, dashboard, profile, and settings remain available to internal admins", () => {
  for (const pathname of [
    "/admin",
    "/admin/products",
    "/admin/products/detail",
    "/admin/profile",
    "/admin/settings",
    "/admin/settings/security",
  ]) {
    const { html, redirects } = render("components/admin/PageAccessGate.tsx", {
      pathname,
      children: React.createElement("button", null, "Konten diizinkan"),
    });
    assert.match(html, /Konten diizinkan/, pathname);
    assert.deepEqual(redirects, []);
  }
  for (const pathname of access.EDITABLE_PAGES.map((page) => page.href)) {
    const { html } = render("components/admin/PageAccessGate.tsx", {
      user: superadmin,
      pathname,
      children: "Akses penuh",
    });
    assert.match(html, /Akses penuh/);
  }
});

test("loading or absent authentication cannot render protected content", () => {
  for (const options of [{ user: null }, { loading: true }, { loading: true, user: null }]) {
    const { html, redirects } = render("components/admin/PageAccessGate.tsx", {
      ...options,
      children: "Konten rahasia",
    });
    assert.doesNotMatch(html, /Konten rahasia/);
    assert.deepEqual(redirects, []);
  }
});

test("dashboard hides product controls and private inbox content without their permissions", () => {
  const { html } = render("app/(admin)/admin/page.tsx", { user: { role: "Admin Internal", pageAccess: ["services"] } });
  assert.doesNotMatch(html, /\/admin\/products|\/admin\/contact|Produk contoh|Pesan privat|Mitra Institusi Resmi/);
  const productsOnly = render("app/(admin)/admin/page.tsx").html;
  assert.match(productsOnly, /Produk contoh/);
  assert.doesNotMatch(productsOnly, /Pesan privat|\/admin\/contact/);
  const full = render("app/(admin)/admin/page.tsx", { user: superadmin }).html;
  assert.match(full, /Produk contoh/);
  assert.match(full, /Pesan privat/);
});

test("access checks keep empty assignments restricted and legacy landing URLs protected", () => {
  for (const page of [...access.EDITABLE_PAGES.map((page) => page.key), "landing"]) {
    assert.equal(access.canAccessPage({ role: "Admin Internal" }, page), false);
    assert.equal(access.canAccessPage(superadmin, page), true);
  }
  assert.equal(access.canAccessPage(null, "products"), false);
  assert.equal(access.getPageKeyFromPathname("/admin/landing/section"), "landing");
  assert.equal(access.getPageKeyFromPathname("/admin/services-other"), null);
});
