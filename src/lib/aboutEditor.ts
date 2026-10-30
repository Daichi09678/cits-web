import { parsePublicPageContent, type PublicPageContent } from "./publicPageContent";
import type { AboutData } from "@/types/schema";

// The existing image API accepts image addresses, including PNG data URLs, but not empty addresses.
export const EMPTY_ABOUT_LOGO =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=";

export const aboutSectionDescriptions: Record<string, string> = {
  "about-hero-heading":
    "Atur elemen visual dan informasi utama yang ditampilkan di bagian pembuka halaman Tentang Kami.",
  "vision-mission-heading": "Perbarui pengantar, visi, dan misi yang menjadi arah perusahaan.",
  "values-heading": "Kelola budaya kerja dan penjelasan setiap prinsip FOCUS.",
  "milestones-heading": "Perbarui perjalanan dan pencapaian perusahaan dari waktu ke waktu.",
  "awards-heading": "Kelola informasi sertifikasi dan penghargaan perusahaan.",
  "governance-heading": "Perbarui informasi legalitas, perizinan, dan tata kelola perusahaan.",
  "about-cta-heading": "Atur ajakan kerja sama, tujuan tombol, dan jaminan layanan.",
};

export const aboutFieldLabels: Record<string, string> = {
  about_hero_text_1: "Badge kepatuhan",
  about_hero_text_2: "Badge pengalaman",
  about_hero_text_3: "Badge tenaga ahli",
  about_hero_text_4: "Badge legalitas",
  about_hero_text_9: "Keterangan di bawah logo",
  about_hero_text_10: "Label legalitas",
  about_hero_text_12: "Teks tombol utama",
  about_hero_href_11: "Tujuan tombol utama",
  about_hero_text_14: "Teks tombol kedua",
  about_hero_href_13: "Tujuan tombol kedua",
  vision_mission_text_1: "Label pengantar",
  vision_mission_text_2: "Judul bagian",
  vision_mission_text_3: "Lanjutan judul",
  vision_mission_text_4: "Deskripsi pengantar",
  vision_mission_text_5: "Label visi",
  vision_mission_text_6: "Judul visi",
  vision_mission_text_7: "Tanda kutip pembuka",
  vision_mission_text_8: "Tanda kutip penutup",
  vision_mission_text_9: "Poin arah perusahaan 1",
  vision_mission_text_10: "Poin arah perusahaan 2",
  vision_mission_text_11: "Poin arah perusahaan 3",
  vision_mission_text_12: "Label misi",
  vision_mission_text_13: "Judul misi",
  vision_mission_text_14: "Pengantar misi",
  values_text_1: "Label bagian",
  values_text_2: "Judul bagian",
  values_text_3: "Lanjutan judul",
  values_text_4: "Deskripsi budaya kerja",
  values_text_5: "Label urutan prinsip",
  milestones_text_1: "Label bagian",
  milestones_text_2: "Judul bagian",
  milestones_text_3: "Lanjutan judul",
  milestones_text_4: "Deskripsi riwayat perusahaan",
  awards_text_1: "Label bagian",
  awards_text_2: "Judul bagian",
  awards_text_3: "Lanjutan judul",
  awards_text_4: "Deskripsi sertifikasi dan penghargaan",
  awards_text_5: "Keterangan sertifikat",
  governance_text_1: "Label bagian",
  governance_text_2: "Judul bagian",
  governance_text_3: "Lanjutan judul",
  governance_text_4: "Deskripsi legalitas dan tata kelola",
  governance_text_5: "Label kepatuhan",
  about_cta_text_1: "Label ajakan kerja sama",
  about_cta_text_2: "Judul ajakan kerja sama",
  about_cta_text_3: "Deskripsi ajakan kerja sama",
  about_cta_href_4: "Tujuan tombol utama",
  about_cta_text_5: "Teks tombol utama",
  about_cta_href_6: "Tujuan tombol kedua",
  about_cta_text_7: "Teks tombol kedua",
  about_cta_href_8: "Tujuan tombol ketiga",
  about_cta_text_9: "Teks tombol ketiga",
  about_cta_text_10: "Jaminan waktu respons",
  about_cta_text_11: "Jaminan kerahasiaan",
  about_cta_text_12: "Keterangan kantor",
};

export function prepareAboutContent(content: PublicPageContent): PublicPageContent {
  return parsePublicPageContent("about", {
    ...content,
    collections: Object.fromEntries(
      Object.entries(content.collections).map(([key, rows]) => [
        key,
        rows.map((row) =>
          Object.fromEntries(
            Object.entries(row).map(([field, value]) => [
              field,
              Array.isArray(value) ? value.map((line) => line.trim()).filter(Boolean) : value,
            ])
          )
        ),
      ])
    ),
  });
}

/** Keep the existing two APIs independent and report partial saves accurately. */
export async function persistAboutChanges({
  profile,
  content,
  saveProfile,
  saveContent,
}: {
  profile: AboutData | null;
  content: PublicPageContent | null;
  saveProfile: (profile: AboutData) => Promise<void>;
  saveContent: (content: PublicPageContent) => Promise<void>;
}): Promise<{ profileSaved: boolean; contentSaved: boolean; error: string }> {
  let profileSaved = false;
  let contentSaved = false;
  try {
    if (profile && [profile.title, profile.subtitle, profile.story, profile.vision].some((value) => !value.trim()))
      throw new Error("Judul, subjudul, deskripsi profil, dan visi perusahaan wajib diisi.");
    const validated = content ? prepareAboutContent(content) : null;
    if (profile) {
      await saveProfile(profile);
      profileSaved = true;
    }
    if (validated) {
      await saveContent(validated);
      contentSaved = true;
    }
    return { profileSaved, contentSaved, error: "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Perubahan belum dapat disimpan. Silakan coba lagi.";
    return {
      profileSaved,
      contentSaved,
      error: profileSaved
        ? `Profil perusahaan sudah tersimpan. Perubahan bagian lainnya belum tersimpan: ${message} Silakan tekan Simpan Perubahan untuk mencoba kembali.`
        : message,
    };
  }
}
