import type { Metadata } from "next";
import ManagedTeamSection from "@/components/ui/ManagedTeamSection";

export const metadata: Metadata = {
  title: "Tim Kami | CITS Indonesia",
  description: "Kenali tim profesional di balik solusi teknologi informasi CITS Indonesia.",
};

export default function TeamPage() {
  return <ManagedTeamSection showAll />;
}
