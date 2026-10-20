import {
  Code2,
  Cpu,
  Server,
  ShieldCheck,
  Database,
  Cloud,
  Globe,
  Smartphone,
  Layers,
  Monitor,
  Boxes,
  Network,
  Terminal,
  Lock,
  Briefcase,
  FileText,
  Lightbulb,
  Sparkles,
  Headphones,
  Zap,
  BarChart3,
  Truck,
  Radio,
  Settings,
  FileCheck,
  HardDrive,
  LucideIcon,
} from "lucide-react";

export interface PillarIconOption {
  name: string;
  label: string;
  category: "Rekayasa & Software" | "Infrastruktur & Cloud" | "Konsultansi & SPBE" | "Keamanan & Dukungan";
  icon: LucideIcon;
}

export const PILLAR_ICON_OPTIONS: PillarIconOption[] = [
  // Rekayasa & Software
  { name: "Code2", label: "Software / Coding", category: "Rekayasa & Software", icon: Code2 },
  { name: "Terminal", label: "API / DevOps", category: "Rekayasa & Software", icon: Terminal },
  { name: "Boxes", label: "Microservices", category: "Rekayasa & Software", icon: Boxes },
  { name: "Layers", label: "Arsitektur Sistem", category: "Rekayasa & Software", icon: Layers },
  { name: "Globe", label: "Web / Portal", category: "Rekayasa & Software", icon: Globe },
  { name: "Smartphone", label: "Aplikasi Mobile", category: "Rekayasa & Software", icon: Smartphone },

  // Infrastruktur & Cloud
  { name: "Server", label: "Server Enterprise", category: "Infrastruktur & Cloud", icon: Server },
  { name: "Database", label: "Basis Data", category: "Infrastruktur & Cloud", icon: Database },
  { name: "Cloud", label: "Cloud Computing", category: "Infrastruktur & Cloud", icon: Cloud },
  { name: "Network", label: "Jaringan / Network", category: "Infrastruktur & Cloud", icon: Network },
  { name: "Monitor", label: "Hardware & PC", category: "Infrastruktur & Cloud", icon: Monitor },
  { name: "HardDrive", label: "Storage & Backup", category: "Infrastruktur & Cloud", icon: HardDrive },

  // Konsultansi & SPBE
  { name: "Cpu", label: "Teknologi & SPBE", category: "Konsultansi & SPBE", icon: Cpu },
  { name: "Briefcase", label: "Konsultan Bisnis", category: "Konsultansi & SPBE", icon: Briefcase },
  { name: "Lightbulb", label: "Inovasi Strategis", category: "Konsultansi & SPBE", icon: Lightbulb },
  { name: "FileText", label: "Masterplan & KAK", category: "Konsultansi & SPBE", icon: FileText },
  { name: "BarChart3", label: "Analitik & BI", category: "Konsultansi & SPBE", icon: BarChart3 },
  { name: "Sparkles", label: "Transformasi Digital", category: "Konsultansi & SPBE", icon: Sparkles },

  // Keamanan & Dukungan
  { name: "ShieldCheck", label: "Keamanan Siber", category: "Keamanan & Dukungan", icon: ShieldCheck },
  { name: "Lock", label: "Privasi & Enkripsi", category: "Keamanan & Dukungan", icon: Lock },
  { name: "FileCheck", label: "Audit & Kepatuhan", category: "Keamanan & Dukungan", icon: FileCheck },
  { name: "Headphones", label: "Helpdesk & SLA", category: "Keamanan & Dukungan", icon: Headphones },
  { name: "Zap", label: "Performa Tinggi", category: "Keamanan & Dukungan", icon: Zap },
  { name: "Settings", label: "Pemeliharaan", category: "Keamanan & Dukungan", icon: Settings },
  { name: "Truck", label: "Armada & IoT", category: "Infrastruktur & Cloud", icon: Truck },
  { name: "Radio", label: "Telemetri / Nirkabel", category: "Infrastruktur & Cloud", icon: Radio },
];

export const PILLAR_ICON_MAP: Record<string, LucideIcon> = PILLAR_ICON_OPTIONS.reduce(
  (acc, curr) => {
    acc[curr.name] = curr.icon;
    return acc;
  },
  {} as Record<string, LucideIcon>
);

export function getPillarIcon(iconName?: string | LucideIcon): LucideIcon {
  if (!iconName) return Cpu;
  if (typeof iconName === "function" || (typeof iconName === "object" && iconName !== null)) {
    return iconName as LucideIcon;
  }
  if (typeof iconName === "string") {
    // Exact match
    if (PILLAR_ICON_MAP[iconName]) return PILLAR_ICON_MAP[iconName];
    // Case-insensitive match
    const lower = iconName.toLowerCase();
    const found = PILLAR_ICON_OPTIONS.find((opt) => opt.name.toLowerCase() === lower);
    if (found) return found.icon;
  }
  return Cpu;
}
