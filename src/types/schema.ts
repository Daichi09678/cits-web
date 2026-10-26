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
  showOnHome?: boolean; // tampilkan di section unggulan beranda
  updatedAt: string;
}

export type DealStage = "baru" | "diskusi" | "proses" | "kesepakatan" | "selesai" | "batal";

export interface ContactFaqItem {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export interface ContactAnnouncement {
  isActive: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
  type?: "info" | "warning" | "success";
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  mapsUrl?: string;
  emergencyPhone?: string;
  faqs?: ContactFaqItem[];
  customServices?: string[];
  announcement?: ContactAnnouncement;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceRequested: string;
  productId?: string;
  productRequested?: string;
  consultation?: ConsultationDetails;
  message: string;
  status: "unread" | "read" | "replied";
  dealStage?: DealStage;
  dealNotes?: string;
  createdAt: string;
}

export type ConsultationPurpose = "discussion" | "demo" | "quotation" | "customization" | "support";
export type ConsultationSource = "home" | "products" | "services" | "portfolio" | "about" | "contact";

export interface ConsultationRequest {
  purpose?: ConsultationPurpose;
  source?: ConsultationSource;
  referenceId?: string;
  requestedFeatures?: string[];
  expectedOutcome?: string;
  currentSystem?: string;
  timeline?: string;
  usageEstimate?: string;
}

export interface ConsultationDetails extends ConsultationRequest {
  service?: {
    id: string;
    title: string;
    description: string;
    features: string[];
    sla: string;
    details?: string;
    techStack?: string[];
    deliverables?: { label: string; description: string }[];
  };
  product?: { id: string; name: string; description: string; features: string[]; tags: string[] };
  portfolio?: {
    id: string;
    title: string;
    client: string;
    servicePillar: string;
    challenge: string;
    solution: string;
    scopeOfWork: string[];
  };
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
  category?: string;
  title: string;
  badge: string;
  icon: string;
  desc: string;
  sla: string;
  features?: string[];
  tags?: string[];
  image?: string;
  details?: string;
  techStack?: string[];
  caseStudies?: string[];
  deliverables?: { label: string; description: string }[];
  isActive?: boolean;
  showOnHome?: boolean;
}

export interface ClientPartner {
  id: string;
  name: string;
  logo: string;
  category: "Kementerian" | "BUMN" | "Lembaga" | "Swasta";
  isActive: boolean;
  showOnHome?: boolean;
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
    pipelineSteps?: string[];
    tags?: string[];
  };
  cardConsultant?: {
    badge?: string;
    title?: string;
    desc?: string;
    linkText?: string;
    linkUrl?: string;
    items?: string[];
  };
  cardSupplier?: {
    badge?: string;
    title?: string;
    desc?: string;
    linkText?: string;
    linkUrl?: string;
    items?: string[];
  };
  cardFocus?: {
    badge?: string;
    title?: string;
    desc?: string;
    explanation?: string;
    footerText?: string;
    linkText?: string;
    linkUrl?: string;
    focusItems?: { letter: string; word: string; desc: string; detail?: string }[];
  };
  bottomCtaText?: string;
  bottomCtaLink?: string;
}

export interface LandingProductsIntro {
  badge?: string;
  title?: string;
  subtitle?: string;
  card1?: {
    badge?: string;
    title?: string;
    desc?: string;
    linkUrl?: string;
    features?: { title: string; desc: string }[];
    tags?: string[];
  };
  card2?: {
    badge?: string;
    title?: string;
    desc?: string;
    linkUrl?: string;
    features?: string[];
  };
  card3?: {
    badge?: string;
    title?: string;
    desc?: string;
    linkUrl?: string;
    features?: string[];
  };
  card4?: {
    badge?: string;
    title?: string;
    desc?: string;
    linkUrl?: string;
    subProducts?: { name: string; desc: string }[];
    tags?: string[];
  };
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

export interface CaseStudyItem {
  id: string;
  title: string;
  client: string;
  clientShort: string;
  clientLogo: string;
  sector: string;
  categoryTag: string;
  period: string;
  servicePillar: string;
  isFlagship?: boolean;
  tagline: string;
  challenge: string;
  solution: string;
  measurableImpact: {
    highlightValue: string;
    highlightLabel: string;
    detail: string;
  };
  scopeOfWork: string[];
  techStack: string[];
  deliverables: string[];
  isActive?: boolean;
  showOnHome?: boolean;
}
