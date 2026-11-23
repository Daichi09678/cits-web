const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");

const runtime = { react: React, "react/jsx-runtime": require("react/jsx-runtime") };

test("public navigation prioritizes the company profile and includes only available destinations", () => {
  const Navbar = load("components/pages/public/Navbar.tsx", {
    ...runtime,
    "next/link": { default: (props) => React.createElement("a", props) },
    "next/navigation": { usePathname: () => "/about" },
    "framer-motion": {
      motion: {
        header: ({ children, className }) => React.createElement("header", { className }, children),
        span: ({ className }) => React.createElement("span", { className }),
      },
      AnimatePresence: ({ children }) => children,
      useReducedMotion: () => false,
    },
    "lucide-react": { Menu: () => null, X: () => null },
    "@/components/pages/public/ThemeToggle": { default: () => null },
    "@/components/pages/public/CompanyBrand": { CompanyLogo: () => null },
  }).default;
  const html = renderToStaticMarkup(React.createElement(Navbar));
  const links = [...html.matchAll(/<li><a href="([^"]+)"[^>]*>([^<]+)/g)].map((match) => [match[1], match[2]]);
  assert.deepEqual(links, [
    ["/", "Beranda"],
    ["/about", "Tentang Kami"],
    ["/portfolio", "Portofolio"],
    ["/services", "Layanan"],
    ["/products", "Produk"],
    ["/contact", "Hubungi Kami"],
  ]);
  assert.match(html, /href="\/about" aria-current="page"/);
  assert.doesNotMatch(html, /href="\/(?:team|career|news)"/);
});

test("integrated company team section reuses the managed directory and provides a stable anchor", () => {
  const Section = load("components/pages/about/AboutTeamSection.tsx", {
    ...runtime,
    "@/components/ui/TeamDirectory": {
      default: () => React.createElement("div", { "data-managed-team-directory": true }),
    },
  }).default;
  const html = renderToStaticMarkup(React.createElement(Section));
  assert.match(html, /id="tim-kami" aria-labelledby="about-team-heading"/);
  assert.match(html, /id="about-team-heading"/);
  assert.match(html, /data-managed-team-directory="true"/);
});

test("existing team URLs redirect to the integrated company section", () => {
  const calls = [];
  const TeamPage = load("app/(public)/team/page.tsx", {
    "next/navigation": {
      redirect: (url) => {
        calls.push(url);
        throw new Error("NEXT_REDIRECT");
      },
    },
  }).default;
  assert.throws(() => TeamPage(), /NEXT_REDIRECT/);
  assert.deepEqual(calls, ["/about#tim-kami"]);
});
