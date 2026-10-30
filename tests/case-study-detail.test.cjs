const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");

const initial = load("data/initialData.ts", {});
const facts = load("data/caseStudyFacts.ts", {});

const wrap = ({ children, animate, transition, whileHover, ...props }) =>
  React.createElement("div", props, children);
const link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);

test("setiap fakta studi kasus terhubung ke proyek portofolio yang ada", () => {
  const ids = new Set(initial.initialCaseStudies.map((item) => item.id));
  for (const id of Object.keys(facts.caseStudyEvidence)) assert.ok(ids.has(id), `id tidak dikenal: ${id}`);
  assert.ok(Object.keys(facts.caseStudyEvidence).length >= 3);
});

test("fakta dan sumber memakai data terisi dengan tautan https resmi", () => {
  for (const [id, evidence] of Object.entries(facts.caseStudyEvidence)) {
    assert.ok(evidence.overview.length > 80, `${id}: overview terlalu pendek`);
    assert.ok(evidence.facts.length >= 3, `${id}: butuh minimal 3 fakta`);
    assert.ok(evidence.sources.length >= 2, `${id}: butuh minimal 2 sumber`);

    for (const fact of evidence.facts) {
      assert.ok(fact.label.trim(), `${id}: label fakta kosong`);
      assert.ok(fact.value.trim(), `${id}: nilai fakta kosong`);
      assert.ok(fact.detail.length > 20, `${id}: detail fakta terlalu pendek`);
    }

    const urls = new Set();
    for (const source of evidence.sources) {
      assert.ok(source.label.trim(), `${id}: label sumber kosong`);
      assert.ok(source.publisher.trim(), `${id}: publisher kosong`);
      assert.match(source.url, /^https:\/\/[^\s]+$/, `${id}: url bukan https (${source.url})`);
      assert.ok(!urls.has(source.url), `${id}: url duplikat (${source.url})`);
      urls.add(source.url);
    }
  }
});

test("kartu klien pada mockup beranda menautkan langsung ke halaman detail studi kasus", () => {
  const HeroMockup = load("components/ui/HeroMockup.tsx", {
    react: React,
    "react/jsx-runtime": require("react/jsx-runtime"),
    "framer-motion": { motion: { div: wrap } },
    "next/link": { default: link },
    "lucide-react": require("lucide-react"),
  }).default;

  const html = renderToStaticMarkup(
    React.createElement(HeroMockup, {
      projects: [
        {
          id: "ktp-el",
          title: "KTP Elektronik",
          client: "Kementerian Dalam Negeri RI",
          clientShort: "Kemendagri RI",
          isActive: true,
          showOnHome: true,
          measurableImpact: { highlightValue: "100+ Juta", highlightLabel: "Verifikasi NIK" },
        },
        {
          id: "simlala",
          title: "SIMLALA",
          client: "Kementerian Perhubungan RI",
          clientShort: "Kemenhub RI",
          isActive: true,
          showOnHome: true,
          measurableImpact: { highlightValue: "70%", highlightLabel: "Efisiensi Waktu" },
        },
      ],
    })
  );

  assert.match(html, /href="\/portfolio\/ktp-el"/);
  assert.match(html, /href="\/portfolio\/simlala"/);
  assert.match(html, /Lihat detail studi kasus Kemendagri RI/);
});
