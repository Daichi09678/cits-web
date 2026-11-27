"use client";

import { useRef, useState, type FormEvent } from "react";
import { AboutField, AboutFieldGroup, AboutLogoField } from "@/components/admin/about/AboutFields";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import FormFeedback from "@/components/ui/FormFeedback";
import { useAdminAuth } from "@/lib/auth";
import { resolveFooterTexts } from "@/lib/footerContent";
import { canPerformAction } from "@/lib/internalAccess";
import { pageDefinition } from "@/lib/publicPageContent";
import { usePublicPageContent } from "@/lib/publicPageContentClient";
import { useCitsStore } from "@/stores/citsStore";

const resources = ["about"] as const;
const fields = pageDefinition("footer").sections[0].fields;

export default function FooterEditor() {
  const { session } = useAdminAuth();
  const { aboutData } = useCitsStore(resources);
  const { content: about } = usePublicPageContent("about");
  const { content, loading, loadError, save, retryLoad } = usePublicPageContent("footer");
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);
  const [reading, setReading] = useState(0);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const texts = resolveFooterTexts({ ...content.texts, ...draft }, about.texts, aboutData.subtitle);
  const canEdit = canPerformAction(session?.user, "contact", "edit");
  const dirty = Object.keys(draft).length > 0;

  function change(patch: Record<string, string>) {
    setDraft((previous) => ({ ...previous, ...patch }));
    setSaved(false);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || loading || loadError || !canEdit || !dirty || reading) return;
    pending.current = true;
    setSaving(true);
    setError("");
    try {
      await save({ ...content, texts: { ...content.texts, ...draft } });
      setDraft({});
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Footer belum tersimpan.");
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 min-w-0 space-y-5 border-t border-gray-200 pt-6 dark:border-white/10">
      {loadError && (
        <FormFeedback tone="error">
          {loadError} <Button onClick={() => void retryLoad()}>Coba lagi</Button>
        </FormFeedback>
      )}
      {loading && (
        <p role="status" className="text-sm">
          Memuat footer...
        </p>
      )}
      <fieldset
        aria-label="Isi footer"
        disabled={loading || !!loadError || !canEdit || saving || reading > 0}
        className="min-w-0 space-y-6"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white">Tampilan Footer</h3>
        <AboutFieldGroup title="Logo Footer">
          {[false, true].map((dark) => {
            const src = dark ? "footer_logo_dark" : "footer_logo_light";
            const alt = dark ? "footer_logo_alt_dark" : "footer_logo_alt_light";
            return (
              <AboutLogoField
                key={src}
                dark={dark}
                value={texts[src]}
                alt={texts[alt]}
                onChange={(value, description) => change({ [src]: value, [alt]: description })}
                onReading={(active) => setReading((count) => count + (active ? 1 : -1))}
                onError={setError}
                maxSizeMb={1.5}
              />
            );
          })}
        </AboutFieldGroup>
        <AboutFieldGroup title="Teks Footer">
          {fields
            .filter(({ key }) => !key.startsWith("footer_logo_"))
            .map(({ key, label, kind }) => (
              <AboutField
                key={key}
                label={label}
                value={texts[key]}
                multiline={kind === "textarea"}
                onChange={(value) => change({ [key]: value })}
              />
            ))}
        </AboutFieldGroup>
        <Button type="submit" disabled={!dirty} busy={saving}>
          Simpan Footer
        </Button>
      </fieldset>
      {saved && <FormFeedback tone="success">Footer berhasil disimpan.</FormFeedback>}
      {error && <FormFeedback tone="error">{error}</FormFeedback>}
    </form>
  );
}
