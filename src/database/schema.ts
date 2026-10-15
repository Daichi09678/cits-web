export interface ProductItem {
  id: string;
  name: string;
  category: "Enterprise" | "Government" | "Mobile" | "Web" | "Communication" | "General";
  description: string;
  features: string[];
  tags: string[];
  icon: string; // nama icon lucide: MessageSquare, Smartphone, FileText, Vote, Globe, Archive, Server, Database, Shield
  image?: string; // foto / gambar produk (URL atau Base64 data URL)
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

export interface ServicePillar {
  id: string;
  title: string;
  badge: string;
  icon: string;
  desc: string;
  sla: string;
  features?: string[];
  isActive?: boolean;
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

export interface SectionVisibility {
  hero: boolean;
  highlights: boolean;
  services: boolean;
  products: boolean;
  clients: boolean;
  cta: boolean;
}

export interface LandingHero {
  badgeText: string;
  headlinePrefix: string;
  typewriterWords: string[];
  subheadline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  trustBadges: string[];
  showMockup?: boolean;
  mockupTitle?: string;
  mockupStatus?: string;
}

export interface LandingHighlight {
  label: string;
  value: string;
  isActive?: boolean;
}

export interface LandingServicesIntro {
  badge: string;
  title: string;
  subtitle: string;
  cardSoftwareHouse?: {
    badge?: string;
    title?: string;
    desc?: string;
    linkText?: string;
    linkUrl?: string;
  };
  cardConsultant?: {
    badge?: string;
    title?: string;
    desc?: string;
    linkText?: string;
    linkUrl?: string;
  };
  cardSupplier?: {
    badge?: string;
    title?: string;
    desc?: string;
    linkText?: string;
    linkUrl?: string;
  };
  cardFocus?: {
    badge?: string;
    title?: string;
    desc?: string;
    footerText?: string;
    linkText?: string;
    linkUrl?: string;
  };
  bottomCtaText?: string;
  bottomCtaLink?: string;
}

export interface LandingProductsIntro {
  badge?: string;
  title?: string;
  subtitle?: string;
  card1?: { badge?: string; title?: string; desc?: string; linkUrl?: string };
  card2?: { badge?: string; title?: string; desc?: string; linkUrl?: string };
  card3?: { badge?: string; title?: string; desc?: string; linkUrl?: string };
  card4?: { badge?: string; title?: string; desc?: string; linkUrl?: string };
  bottomCtaText?: string;
  bottomCtaLink?: string;
}

export interface LandingClientsIntro {
  title?: string;
}

export interface LandingCta {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryText?: string;
  primaryLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export interface LandingPageData {
  id?: string;
  sectionVisibility?: SectionVisibility;
  hero: LandingHero;
  highlights: LandingHighlight[];
  servicesIntro: LandingServicesIntro;
  productsIntro?: LandingProductsIntro;
  clientsIntro?: LandingClientsIntro;
  cta: LandingCta;
  updatedAt?: string;
}



