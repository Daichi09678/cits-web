const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

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

export const citsApi = {
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
    });
    return res.json();
  },

  // 2. Products
  async getActiveProducts() {
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    const json = await res.json();
    return json.data || [];
  },

  async getAllProducts() {
    const res = await fetch(`${API_URL}/products/all`, { cache: "no-store" });
    const json = await res.json();
    return json.data || [];
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
    name: string;
    email: string;
    phone: string;
    company: string;
    serviceRequested?: string;
    message: string;
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
    const json = await res.json();
    return json.data || [];
  },

  async updateMessageStatus(id: string, status: "unread" | "read" | "replied") {
    const res = await fetch(`${API_URL}/messages/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
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

  // 4. About Data
  async getAboutData() {
    const res = await fetch(`${API_URL}/about`, { cache: "no-store" });
    const json = await res.json();
    return json.data || null;
  },

  async updateAboutData(data: any) {
    const res = await fetch(`${API_URL}/about`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // 5. Contact Info
  async getContactInfo() {
    const res = await fetch(`${API_URL}/contact`, { cache: "no-store" });
    const json = await res.json();
    return json.data || null;
  },

  async updateContactInfo(data: any) {
    const res = await fetch(`${API_URL}/contact`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // 6. Clients
  async getClients() {
    const res = await fetch(`${API_URL}/clients`, { cache: "no-store" });
    const json = await res.json();
    return json.data || [];
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
      body: formData,
    });
    return res.json();
  },

  // 8. Landing Page Data
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
  async getServices() {
    const res = await fetch(`${API_URL}/services`, { cache: "no-store" });
    const json = await res.json();
    return json.data || [];
  },

  async updateServices(data: any) {
    const res = await fetch(`${API_URL}/services`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // 10. Portfolio / Case Studies
  async getPortfolio() {
    const res = await fetch(`${API_URL}/portfolio`, { cache: "no-store" });
    const json = await res.json();
    return json.data || [];
  },

  async updatePortfolio(data: any) {
    const res = await fetch(`${API_URL}/portfolio`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
