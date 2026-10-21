import { redirect } from "next/navigation";

/** Halaman lama Manajemen Role & Hak Akses kini menyatu di Pengaturan. */
export default function AdminRolesRedirectPage() {
  redirect("/admin/settings");
}
