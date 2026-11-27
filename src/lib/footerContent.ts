export function resolveFooterTexts(
  saved: Record<string, string>,
  about: Record<string, string>,
  subtitle: string
): Record<string, string> {
  return {
    footer_logo_light: about.about_hero_src_5,
    footer_logo_dark: about.about_hero_src_7,
    footer_logo_alt_light: about.about_hero_alt_6,
    footer_logo_alt_dark: about.about_hero_alt_8,
    footer_description: about.footer_description?.trim() || subtitle,
    footer_legal: about.footer_legal,
    footer_contact_heading: about.footer_contact_heading,
    footer_map_label: about.footer_map_label,
    footer_whatsapp_label: about.footer_whatsapp_label,
    footer_copyright: about.footer_copyright,
    footer_copyright_year: "",
    ...saved,
  };
}
