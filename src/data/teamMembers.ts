import type { TeamMember } from "@/lib/team";

// Fictional profiles for layout previews, never official staff identities.
const exampleTeams = [
  {
    name: "Pengembangan Aplikasi",
    members: [
      [2, "Rina Amalia", "Lead Software Engineer"],
      [5, "Aditya Pratama", "Full Stack Developer"],
      [6, "Nabila Putri", "Frontend Developer"],
      [7, "Fajar Ramadhan", "Backend Developer"],
      [8, "Siti Rahmawati", "Mobile Developer"],
      [9, "Rizky Maulana", "Quality Assurance Engineer"],
    ],
  },
  {
    name: "Konsultasi TI",
    members: [
      [3, "Budi Prasetyo", "Lead IT Consultant"],
      [10, "Intan Permatasari", "Business Analyst"],
      [11, "Dimas Saputra", "Enterprise Architect"],
      [12, "Ayu Kartika", "IT Governance Consultant"],
      [13, "Arif Wibowo", "Information Security Consultant"],
      [14, "Maya Anggraini", "Data Management Consultant"],
    ],
  },
  {
    name: "Infrastruktur & Pengadaan",
    members: [
      [15, "Hendra Setiawan", "Infrastructure Lead"],
      [16, "Putri Maharani", "IT Procurement Specialist"],
      [17, "Yoga Pratama", "System Administrator"],
      [18, "Reza Firmansyah", "Network Engineer"],
      [19, "Dian Puspita", "Hardware & Storage Specialist"],
      [20, "Taufik Hidayat", "Technical Support Engineer"],
    ],
  },
  {
    name: "Manajemen Proyek",
    members: [
      [1, "Andi Setiawan", "Head of Project Management"],
      [4, "Dewi Lestari", "Business Development Manager"],
      [21, "Bagus Kurniawan", "Project Manager"],
      [22, "Ratna Sari", "Project Coordinator"],
      [23, "Farhan Akbar", "Account Executive"],
      [24, "Lestari Wulandari", "Technical Documentation Specialist"],
    ],
  },
] as const;

export const demoTeamMembers: TeamMember[] = exampleTeams.flatMap((team, teamIndex) =>
  team.members.map(([id, name, position], memberIndex) => ({
    id: `demo-team-${id}`,
    name,
    position,
    teamName: team.name,
    photoUrl: null,
    // Interleave leads so the homepage preview represents all four teams.
    displayOrder: memberIndex * exampleTeams.length + teamIndex + 1,
    isActive: true,
    showOnHomepage: true,
    isDemo: true,
  }))
);
