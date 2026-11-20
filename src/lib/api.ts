import { assertPageAction } from "./actionAccessClient";
import type { TeamMember, TeamMemberInput } from "./team";
import type { ConsultationRequest, ServicePillar } from "@/types/schema";
import type { HomeEditorPage, HomeSectionPatch } from "@/lib/homeSections";
import type { PublicContentPage, PublicPageContent } from "@/lib/publicPageContent";

const API_URL = "/api";

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (typeof window !== "undefined") {
    const savedToken = localStorage.getItem("cits_jwt_token");
    if (savedToken) {
      headers["Authorization"] = `Bearer ${savedToken}`;
    }
  }
  return headers;
}

async function fetchCatalog(path: string, adminQuery: string | null) {
  const url = `${API_URL}/${path}`;
  if (adminQuery) {
    const response = await fetch(`${url}?${adminQuery}`, { headers: getHeaders(), cache: "no-store" });
    if (response.status !== 401 && response.status !== 403) return response;
  }
  return fetch(url, { cache: "no-store" });
}

export const citsApi = {
  getTeamMembers(admin = false): Promise<TeamMember[]> {
    return teamRequest<TeamMember[]>(`/team${admin ? "?admin=1" : ""}`);
  },
  seedTeamExamples(): Promise<TeamMember[]> {
    assertPageAction("team", "create");
    return teamRequest<TeamMember[]>("/team/examples", "POST");
  },
  createTeamMember(input: TeamMemberInput): Promise<TeamMember> {
    assertPageAction("team", "create");
    return teamRequest<TeamMember>("/team", "POST", input);
  },
  updateTeamMember(id: string, input: TeamMemberInput): Promise<TeamMember> {
    assertPageAction("team", "edit");
    return teamRequest<TeamMember>(`/team/${encodeURIComponent(id)}`, "PUT", input);
  },
  deleteTeamMember(id: string): Promise<void> {
    assertPageAction("team", "delete");
    return teamRequest<void>(`/team/${encodeURIComponent(id)}`, "DELETE");
  },
  async getPublicPageContent(page: PublicContentPage): Promise<PublicPageContent> {
    const response = await fetch(`${API_URL}/page-content/${page}`, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data)
      throw new Error(result.message || "Konten halaman gagal dimuat.");
    return result.data;
  },
  async updatePublicPageContent(page: PublicContentPage, data: PublicPageContent): Promise<PublicPageContent> {
    assertPageAction(page, "edit");
    const response = await fetch(`${API_URL}/page-content/${page}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data)
      throw new Error(result.message || "Konten halaman gagal disimpan.");
    return result.data;
  },
  // 1. Authentication
  async login(email: string, pass: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });
    return res.json();
  },

  async getMe(token?: string) {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(token),
      cache: "no-store",
    });
    return { ...(await res.json()), status: res.status };
  },

  // 2. Products
  async getActiveProducts() {
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    const json = await res.json();
    return json.data || [];
  },

  async getAllProducts() {
    const res = await fetchCatalog("products", "Authorization" in getHeaders() ? "all=true" : null);
    if (!res.ok) throw new Error(`API getAllProducts failed: ${res.status}`);
    const json = await res.json();
    if (!json?.success || !Array.isArray(json.data)) throw new Error("Invalid products response");
    return json.data;
  },

  async getProductById(id: string) {
    const res = await fetch(`${API_URL}/products/${id}`);
    const json = await res.json();
    return json.data || null;
  },

  async createProduct(data: any) {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateProduct(id: string, data: any) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // 3. Contact Messages
  async sendMessage(data: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    serviceRequested?: string;
    productId?: string;
    consultation?: ConsultationRequest;
    message: string;
    consent: true;
  }) {
    const res = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getMessages() {
    const res = await fetch(`${API_URL}/messages`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`API getMessages failed: ${res.status}`);
    }
    const json = await res.json();
    if (!json?.success || !Array.isArray(json.data)) {
      throw new Error("Invalid inbox response");
    }
    return json.data;
  },

  async updateMessageStatus(id: string, status: "unread" | "read" | "replied") {
    const res = await fetch(`${API_URL}/messages/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  async updateMessageStage(id: string, dealStage: string, dealNotes?: string) {
    const res = await fetch(`${API_URL}/messages/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ dealStage, dealNotes }),
    });
    return res.json();
  },

  async deleteMessage(id: string) {
    const res = await fetch(`${API_URL}/messages/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  async deleteMessages(ids: string[]) {
    const res = await fetch(`${API_URL}/messages`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ ids }),
    });
    return res.json();
  },

  // 4. About Data
  async getAboutData() {
    const res = await fetch(`${API_URL}/about`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || !json?.success || !json.data) throw new Error(json.message || "Profil perusahaan gagal dimuat.");
    return json.data;
  },

  async updateAboutData(data: any) {
    const res = await fetch(`${API_URL}/about`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result.success || !result.data)
      throw new Error(result.message || "Profil perusahaan gagal disimpan.");
    return result;
  },

  // 5. Contact Info
  async getContactInfo() {
    const res = await fetch(`${API_URL}/contact`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || !json?.success || !json.data) throw new Error(json.message || "Informasi kontak gagal dimuat.");
    return json.data;
  },

  async updateContactInfo(data: any) {
    const res = await fetch(`${API_URL}/contact`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result?.success || !result.data)
      throw new Error(result.message || "Informasi kontak gagal disimpan.");
    return result;
  },

  // 6. Clients
  async getClients(admin = false) {
    const res = await fetchCatalog("clients", admin ? "admin=1" : null);
    const json = await res.json();
    if (!res.ok || !json?.success || !Array.isArray(json.data))
      throw new Error(json.message || "Daftar mitra gagal dimuat.");
    return json.data;
  },

  async createClient(data: any) {
    const res = await fetch(`${API_URL}/clients`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateClient(id: string, data: any) {
    const res = await fetch(`${API_URL}/clients/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteClient(id: string) {
    const res = await fetch(`${API_URL}/clients/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },

  // 7. File Upload
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/uploads`, {
      method: "POST",
      headers: Object.fromEntries(Object.entries(getHeaders()).filter(([key]) => key !== "Content-Type")),
      body: formData,
    });
    return res.json();
  },

  // 8. Landing Page Data
  async updateHomeSection(page: HomeEditorPage, patch: HomeSectionPatch) {
    const response = await fetch(`${API_URL}/landing/${page}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(patch),
    });
    const result = await response.json();
    if (!response.ok || !result.success || !result.data)
      throw new Error(result.message || "Isi beranda gagal disimpan.");
    return result;
  },

  async getLandingData() {
    const res = await fetch(`${API_URL}/landing`, { cache: "no-store" });
    const json = await res.json();
    return json.data || null;
  },

  async updateLandingData(data: any) {
    const res = await fetch(`${API_URL}/landing`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // 9. Services Data
  async getServices(admin = false) {
    const res = await fetchCatalog("services", admin ? "admin=1" : null);
    const json = await res.json();
    if (!res.ok || !json?.success || !Array.isArray(json.data))
      throw new Error(json.message || "Layanan gagal dimuat.");
    return json.data;
  },

  async updateServices(data: ServicePillar[]) {
    const res = await fetch(`${API_URL}/services`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result?.success || !Array.isArray(result.data))
      throw new Error(result?.message || "Layanan gagal disimpan ke server.");
    return result as { success: true; data: ServicePillar[] };
  },

  // 10. Portfolio / Case Studies
  async getPortfolio(admin = false) {
    const res = await fetchCatalog("portfolio", admin ? "admin=1" : null);
    const json = await res.json();
    if (!res.ok || !json?.success || !Array.isArray(json.data))
      throw new Error(json.message || "Portofolio gagal dimuat.");
    return json.data;
  },

  async updatePortfolio(data: any) {
    const res = await fetch(`${API_URL}/portfolio`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok || !result?.success || !Array.isArray(result.data))
      throw new Error(result.message || "Portofolio gagal disimpan.");
    return result;
  },
};

async function teamRequest<T>(path: string, method = "GET", body?: TeamMemberInput): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: getHeaders(),
    cache: "no-store",
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || "Permintaan data tim gagal.");
  return result.data as T;
}
