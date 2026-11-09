import { redirect } from "next/navigation";

/** Preserve existing team links after consolidating the company profile. */
export default function TeamPage() {
  redirect("/about#tim-kami");
}
