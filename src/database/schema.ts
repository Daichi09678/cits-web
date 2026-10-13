export interface ProductItem {
  id: string;
  name: string;
  category: "Enterprise" | "Government" | "Mobile" | "Web" | "Communication" | "General";
  description: string;
  features: string[];
  tags: string[];
  icon: string; // nama icon lucide: MessageSquare, Smartphone, FileText, Vote, Globe, Archive, Server, Database, Shield
  isActive: boolean; // toggle aktif / non-aktif
  updatedAt: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  mapsUrl?: string;
  emergencyPhone?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceRequested: string;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export interface AboutStat {
  label: string;
  value: string;
  description: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  story: string;
  vision: string;
  mission: string[];
  coreValues: {
    title: string;
    description: string;
  }[];
  stats: AboutStat[];
}

export interface ClientPartner {
  id: string;
  name: string;
  logo: string;
  category: "Kementerian" | "BUMN" | "Lembaga" | "Swasta";
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Editor";
  avatar: string;
}
