const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");
const presentation = load("lib/contactPresentation.ts");
const contact = {
  address: "Kantor Baru, Bandung & Jakarta",
  phone: "021 123456",
  email: "baru@example.test",
  workingHours: "Senin 09.00–16.00",
  emergencyPhone: "0812 3456 7890",
};

test("contact channels use the saved office address and WhatsApp number, including clearing", () => {
  const links = presentation.contactPresentation(contact);
  assert.equal(new URL(links.mapUrl).searchParams.get("query"), contact.address);
  assert.equal(new URL(links.mapEmbedUrl).searchParams.get("q"), contact.address);
  assert.match(links.whatsappUrl, /wa\.me\/6281234567890/);
  assert.equal(presentation.contactPresentation({ ...contact, emergencyPhone: "" }).whatsappUrl, "");
  assert.match(
    presentation.contactPresentation({ ...contact, emergencyPhone: "+62 811 777" }).whatsappUrl,
    /wa\.me\/62811777/
  );
});

function renderFooter(services, info = contact) {
  const Footer = load("components/layout/Footer.tsx", {
    react: React,
    "react/jsx-runtime": require("react/jsx-runtime"),
    "lucide-react": require("lucide-react"),
    "next/link": { default: ({ children, ...props }) => React.createElement("a", props, children) },
    "@/components/layout/CompanyBrand": { CompanyLogo: () => null },
    "@/lib/contactPresentation": presentation,
    "@/data/initialData": { initialContactInfo: contact },
    "@/stores/citsStore": {
      useCitsStore: () => ({ contactInfo: info, services, aboutData: { subtitle: "Profil tersimpan dari admin" } }),
    },
  }).default;
  return renderToStaticMarkup(React.createElement(Footer));
}

test("footer publishes edited company/contact content and only the current active service catalog", () => {
  const html = renderFooter([
    { id: "new-service", title: "Layanan terbaru", isActive: true },
    { id: "hidden-service", title: "Layanan nonaktif", isActive: false },
  ]);
  for (const value of [
    "Profil tersimpan dari admin",
    "baru@example.test",
    "Layanan terbaru",
    "Kantor Baru, Bandung &amp; Jakarta",
    "6281234567890",
  ])
    assert.ok(html.includes(value), value);
  assert.match(html, /href="\/services#new-service"/);
  assert.doesNotMatch(html, /Layanan nonaktif|6281239719677|Pengembangan Perangkat Lunak/);
  const cleared = renderFooter([], { ...contact, emergencyPhone: "" });
  assert.doesNotMatch(cleared, /wa\.me|Layanan terbaru|Layanan nonaktif/);
});
