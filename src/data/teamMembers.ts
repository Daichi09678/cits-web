import type { TeamMember } from "@/components/ui/TeamMemberCard";

// Data contoh untuk preview layout, bukan identitas anggota resmi CITS Indonesia.
// Ganti dengan data asli dari CMS/API ketika tersedia.
export const demoTeamMembers: TeamMember[] = [
  {
    id: "demo-team-1",
    name: "Andi Setiawan",
    position: "Chief Executive Officer",
    photoUrl: null,
    displayOrder: 1,
    isActive: true,
    showOnHomepage: true,
  },
  {
    id: "demo-team-2",
    name: "Rina Amalia",
    position: "Chief Technology Officer",
    photoUrl: null,
    displayOrder: 2,
    isActive: true,
    showOnHomepage: true,
  },
  {
    id: "demo-team-3",
    name: "Budi Prasetyo",
    position: "Head of Project Management",
    photoUrl: null,
    displayOrder: 3,
    isActive: true,
    showOnHomepage: true,
  },
  {
    id: "demo-team-4",
    name: "Dewi Lestari",
    position: "Head of Business Development",
    photoUrl: null,
    displayOrder: 4,
    isActive: true,
    showOnHomepage: true,
  },
];
