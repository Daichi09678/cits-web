"use client";

import { useEffect, useState, useRef } from "react";
import {
  ProductItem,
  ContactInfo,
  ContactMessage,
  AboutData,
  ClientPartner,
  LandingPageData,
  ServicePillar,
  CaseStudyItem,
} from "./schema";
import {
  initialProducts,
  initialContactInfo,
  initialAboutData,
  initialClients,
  initialLandingPageData,
  initialServicePillars,
  initialCaseStudies,
} from "./initialData";
import { siteConfig } from "@/config/siteConfig";
import { citsApi } from "@/lib/api";
import { playNewMessageSound } from "@/lib/audio";

// ─── Deleted Message ID Tracking ───────────────────────────────────────
function getDeletedMessageIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem("cits_deleted_message_ids");
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function markMessageDeleted(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const set = getDeletedMessageIds();
    set.add(id);
    sessionStorage.setItem("cits_deleted_message_ids", JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error("Failed to mark message as deleted", e);
  }
}

function isMessageDeleted(id: string): boolean {
  return getDeletedMessageIds().has(id);
}

// ─── Notified Message ID Tracking (prevents duplicate toasts/sounds) ───
function getNotifiedMessageIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem("cits_notified_message_ids");
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function markMessageNotified(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const set = getNotifiedMessageIds();
    set.add(id);
    // Cap at 200 entries to prevent unbounded growth
    const arr = Array.from(set);
    if (arr.length > 200) arr.splice(0, arr.length - 200);
    sessionStorage.setItem("cits_notified_message_ids", JSON.stringify(arr));
  } catch {
    // silent
  }
}

const notifiedInMemory = new Set<string>();

function isMessageNotified(id: string): boolean {
  return notifiedInMemory.has(id) || getNotifiedMessageIds().has(id);
}

// ─── Optimistic Status Update Cache ────────────────────────────────────
function getRecentStatusUpdates(): Record<string, { status: "unread" | "read" | "replied"; timestamp: number }> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem("cits_recent_status_updates");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveRecentStatusUpdate(id: string, status: "unread" | "read" | "replied"): void {
  if (typeof window === "undefined") return;
  try {
    const map = getRecentStatusUpdates();
    map[id] = { status, timestamp: Date.now() };
    sessionStorage.setItem("cits_recent_status_updates", JSON.stringify(map));
  } catch (e) {
    console.error("Failed to save status update", e);
  }
}

// ─── Optimistic Local Messages Cache (survives until server confirms) ──
function getOptimisticMessages(): ContactMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem("cits_optimistic_messages");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function addOptimisticMessage(msg: ContactMessage): void {
  if (typeof window === "undefined") return;
  try {
    const list = getOptimisticMessages();
    list.push(msg);
    sessionStorage.setItem("cits_optimistic_messages", JSON.stringify(list));
  } catch {
    // silent
  }
}

function removeOptimisticMessage(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getOptimisticMessages().filter((m) => m.id !== id);
    sessionStorage.setItem("cits_optimistic_messages", JSON.stringify(list));
  } catch {
    // silent
  }
}

// ─── localStorage Helpers ──────────────────────────────────────────────
function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("cits-data-updated"));
  } catch (e) {
    console.error("Failed to write to localStorage", e);
  }
}

// ─── Notification Helper (deduplicated) ────────────────────────────────
function notifyNewMessage(msg: ContactMessage): void {
  if (isMessageNotified(msg.id)) return;
  notifiedInMemory.add(msg.id);
  markMessageNotified(msg.id);
  playNewMessageSound();
  window.dispatchEvent(new CustomEvent("cits-realtime-message", { detail: msg }));
}

// ─── Merge server messages with optimistic local messages ──────────────
function mergeMessagesWithOptimistic(serverMsgs: ContactMessage[]): ContactMessage[] {
  const recentMap = getRecentStatusUpdates();
  const validServerMsgs = serverMsgs.filter((m) => !isMessageDeleted(m.id));
  const merged = validServerMsgs.map((serverMsg) => {
    const recent = recentMap[serverMsg.id];
    if (recent && Date.now() - recent.timestamp < 30000) {
      return { ...serverMsg, status: recent.status };
    }
    return serverMsg;
  });

  // Add any optimistic messages not yet confirmed by the server
  const serverIds = new Set(merged.map((m) => m.id));
  const optimistic = getOptimisticMessages().filter(
    (m) => !serverIds.has(m.id) && !isMessageDeleted(m.id)
  );

  // Remove optimistic messages that ARE now on the server (confirmed)
  for (const sm of merged) {
    removeOptimisticMessage(sm.id);
  }

  return [...optimistic, ...merged];
}

// ═══════════════════════════════════════════════════════════════════════
// Global Store API with Optimistic UI & Backend Synchronization
// ═══════════════════════════════════════════════════════════════════════
export const CitsStore = {
  // PRODUCTS
  getProducts(): ProductItem[] {
    return getStorageItem<ProductItem[]>(siteConfig.storageKeys.products, initialProducts);
  },
  getActiveProducts(): ProductItem[] {
    return this.getProducts().filter((p) => p.isActive);
  },
  saveProducts(products: ProductItem[]): void {
    setStorageItem(siteConfig.storageKeys.products, products);
  },
  addProduct(product: Omit<ProductItem, "id" | "updatedAt">): ProductItem {
    const current = this.getProducts();
    const newProduct: ProductItem = {
      ...product,
      id: "prod-" + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    this.saveProducts([newProduct, ...current]);
    citsApi.createProduct(newProduct).catch((err) => console.warn("Sync product error:", err));
    return newProduct;
  },
  updateProduct(id: string, updates: Partial<ProductItem>): void {
    const current = this.getProducts();
    const updated = current.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    this.saveProducts(updated);
    citsApi.updateProduct(id, updates).catch((err) => console.warn("Sync update product error:", err));
  },
  toggleProductStatus(id: string): boolean {
    const current = this.getProducts();
    let newStatus = true;
    const updated = current.map((p) => {
      if (p.id === id) {
        newStatus = !p.isActive;
        return { ...p, isActive: newStatus, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    this.saveProducts(updated);
    citsApi.updateProduct(id, { isActive: newStatus }).catch((err) => console.warn("Sync status error:", err));
    return newStatus;
  },
  deleteProduct(id: string): void {
    const current = this.getProducts();
    this.saveProducts(current.filter((p) => p.id !== id));
    citsApi.deleteProduct(id).catch((err) => console.warn("Sync delete product error:", err));
  },

  // CONTACT INFO
  getContactInfo(): ContactInfo {
    return getStorageItem<ContactInfo>(siteConfig.storageKeys.contactInfo, initialContactInfo);
  },
  saveContactInfo(info: ContactInfo): void {
    setStorageItem(siteConfig.storageKeys.contactInfo, info);
    citsApi.updateContactInfo(info).catch((err) => console.warn("Sync contact info error:", err));
  },

  // CONTACT MESSAGES (INBOX & REALTIME)
  getMessages(): ContactMessage[] {
    const list = getStorageItem<ContactMessage[]>(siteConfig.storageKeys.messages, []);
    return list.filter((m) => !isMessageDeleted(m.id));
  },
  saveMessages(msgs: ContactMessage[]): void {
    const valid = msgs.filter((m) => !isMessageDeleted(m.id));
    setStorageItem(siteConfig.storageKeys.messages, valid);
  },
  async addMessage(msg: Omit<ContactMessage, "id" | "status" | "createdAt"> & { id?: string }): Promise<ContactMessage> {
    const result = await citsApi.sendMessage(msg);
    if (!result?.success || !result.data?.id) {
      throw new Error(result?.message || "Pesan belum tersimpan. Silakan coba lagi.");
    }
    // Only confirmed server records may appear in the local inbox.
    const saved = result.data as ContactMessage;
    this.saveMessages([saved, ...this.getMessages().filter((m) => m.id !== saved.id)]);
    return saved;
  },
  updateMessageStatus(id: string, status: "unread" | "read" | "replied"): void {
    saveRecentStatusUpdate(id, status);
    const current = this.getMessages();
    const updated = current.map((m) => (m.id === id ? { ...m, status } : m));
    this.saveMessages(updated);
    citsApi.updateMessageStatus(id, status).catch((err) => console.warn("Sync msg status error:", err));
  },
  deleteMessage(id: string): void {
    markMessageDeleted(id);
    removeOptimisticMessage(id);
    const current = this.getMessages();
    this.saveMessages(current.filter((m) => m.id !== id));
    citsApi.deleteMessage(id).catch((err) => console.warn("Sync delete message error:", err));
  },

  // ABOUT
  getAboutData(): AboutData {
    return getStorageItem<AboutData>(siteConfig.storageKeys.about, initialAboutData);
  },
  saveAboutData(data: AboutData): void {
    setStorageItem(siteConfig.storageKeys.about, data);
    citsApi.updateAboutData(data).catch((err) => console.warn("Sync about error:", err));
  },

  // CLIENTS
  getClients(): ClientPartner[] {
    return getStorageItem<ClientPartner[]>(siteConfig.storageKeys.clients, initialClients);
  },
  saveClients(clients: ClientPartner[]): void {
    setStorageItem(siteConfig.storageKeys.clients, clients);
  },
  addClient(client: Omit<ClientPartner, "id">): ClientPartner {
    const current = this.getClients();
    const newClient: ClientPartner = {
      ...client,
      id: "client-" + Date.now(),
    };
    const updated = [newClient, ...current];
    this.saveClients(updated);
    citsApi.createClient(newClient).catch((err) => console.warn("Sync client create error:", err));
    return newClient;
  },
  updateClient(id: string, updates: Partial<ClientPartner>): void {
    const current = this.getClients();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.saveClients(updated);
    citsApi.updateClient(id, updates).catch((err) => console.warn("Sync client update error:", err));
  },
  deleteClient(id: string): void {
    const current = this.getClients();
    this.saveClients(current.filter((c) => c.id !== id));
    citsApi.deleteClient(id).catch((err) => console.warn("Sync client delete error:", err));
  },

  // SERVICES (3 PILARS)
  getServices(): ServicePillar[] {
    return getStorageItem<ServicePillar[]>(siteConfig.storageKeys.services, initialServicePillars);
  },
  saveServices(services: ServicePillar[]): void {
    setStorageItem(siteConfig.storageKeys.services, services);
    citsApi.updateServices(services).catch((err) => console.warn("Sync services error:", err));
  },
  updateService(id: string, updates: Partial<ServicePillar>): void {
    const current = this.getServices();
    const updated = current.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.saveServices(updated);
  },

  // LANDING PAGE (HERO, HIGHLIGHTS, SERVICES INTRO, CTA)
  getLandingData(): LandingPageData {
    return getStorageItem<LandingPageData>(siteConfig.storageKeys.landing, initialLandingPageData);
  },
  saveLandingData(data: LandingPageData): void {
    setStorageItem(siteConfig.storageKeys.landing, data);
    citsApi.updateLandingData(data).catch((err) => console.warn("Sync landing error:", err));
  },

  // CASE STUDIES (PORTOFOLIO)
  getCaseStudies(): CaseStudyItem[] {
    return getStorageItem<CaseStudyItem[]>(siteConfig.storageKeys.portfolio, initialCaseStudies);
  },
  getActiveCaseStudies(): CaseStudyItem[] {
    return this.getCaseStudies().filter((c) => c.isActive !== false);
  },
  saveCaseStudies(studies: CaseStudyItem[]): void {
    setStorageItem(siteConfig.storageKeys.portfolio, studies);
    citsApi.updatePortfolio(studies).catch((err) => console.warn("Sync portfolio error:", err));
  },
  addCaseStudy(study: Omit<CaseStudyItem, "id">): CaseStudyItem {
    const current = this.getCaseStudies();
    const newStudy: CaseStudyItem = {
      ...study,
      id: "cs-" + Date.now(),
      isActive: study.isActive !== false,
    };
    this.saveCaseStudies([newStudy, ...current]);
    return newStudy;
  },
  updateCaseStudy(id: string, updates: Partial<CaseStudyItem>): void {
    const current = this.getCaseStudies();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.saveCaseStudies(updated);
  },
  deleteCaseStudy(id: string): void {
    const current = this.getCaseStudies();
    this.saveCaseStudies(current.filter((c) => c.id !== id));
  },
  toggleCaseStudyStatus(id: string): boolean {
    const current = this.getCaseStudies();
    let newStatus = true;
    const updated = current.map((c) => {
      if (c.id === id) {
        newStatus = !(c.isActive !== false);
        return { ...c, isActive: newStatus };
      }
      return c;
    });
    this.saveCaseStudies(updated);
    return newStatus;
  },

  // RESET TO DEFAULT
  resetAllToDefault(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(siteConfig.storageKeys.products);
    localStorage.removeItem(siteConfig.storageKeys.contactInfo);
    localStorage.removeItem(siteConfig.storageKeys.messages);
    localStorage.removeItem(siteConfig.storageKeys.about);
    localStorage.removeItem(siteConfig.storageKeys.clients);
    localStorage.removeItem(siteConfig.storageKeys.landing);
    localStorage.removeItem(siteConfig.storageKeys.services);
    localStorage.removeItem(siteConfig.storageKeys.portfolio);
    window.dispatchEvent(new Event("cits-data-updated"));
  },
};

let inboxConnected = false;
// Notification history persists in sessionStorage across logout/reload.
const observedInboxIds = new Set<string>();
let stopInboxSync: (() => void) | null = null;

// Owned by the authenticated admin layout's toast, never by page/store consumers.
// Use the same API as message submission; a separate SSE backend can be stale.
export function startAdminInboxSync(): () => void {
  stopInboxSync?.();
  let disposed = false;
  let inFlight = false;

  const syncInbox = async () => {
    if (disposed || inFlight) return;
    inFlight = true;
    try {
      const latest = await citsApi.getMessages() as ContactMessage[];
      if (disposed) return;
      const fresh = latest.filter((msg) => !observedInboxIds.has(msg.id));
      latest.forEach((msg) => observedInboxIds.add(msg.id));
      inboxConnected = true;
      CitsStore.saveMessages(mergeMessagesWithOptimistic(latest));
      for (const msg of fresh) {
        if (msg.status === "unread" && !isMessageDeleted(msg.id)) notifyNewMessage(msg);
      }
    } catch {
      if (!disposed) {
        inboxConnected = false;
        window.dispatchEvent(new Event("cits-data-updated"));
      }
    } finally {
      inFlight = false;
    }
  };

  const onFocus = () => {
    if (document.visibilityState === "visible") void syncInbox();
  };
  const interval = setInterval(syncInbox, 3000);
  window.addEventListener("focus", onFocus);
  document.addEventListener("visibilitychange", onFocus);
  void syncInbox();

  const stop = () => {
    disposed = true;
    clearInterval(interval);
    window.removeEventListener("focus", onFocus);
    document.removeEventListener("visibilitychange", onFocus);
    if (stopInboxSync === stop) stopInboxSync = null;
    inboxConnected = false;
  };
  stopInboxSync = stop;
  return stop;
}

// ═══════════════════════════════════════════════════════════════════════
// React Hook — subscribe to store + background sync
// ═══════════════════════════════════════════════════════════════════════
export function useCitsStore() {
  const [products, setProducts] = useState<ProductItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = CitsStore.getProducts();
      if (stored && stored.length > 0) return stored;
    }
    return initialProducts;
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    if (typeof window !== "undefined") {
      return CitsStore.getContactInfo();
    }
    return initialContactInfo;
  });
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    if (typeof window !== "undefined") {
      const stored = CitsStore.getMessages();
      if (stored && Array.isArray(stored)) return stored;
    }
    return [];
  });
  const [aboutData, setAboutData] = useState<AboutData>(() => {
    if (typeof window !== "undefined") {
      return CitsStore.getAboutData();
    }
    return initialAboutData;
  });
  const [clients, setClients] = useState<ClientPartner[]>(() => {
    if (typeof window !== "undefined") {
      const stored = CitsStore.getClients();
      if (stored && stored.length > 0) return stored;
    }
    return initialClients;
  });
  const [services, setServices] = useState<ServicePillar[]>(() => {
    if (typeof window !== "undefined") {
      const stored = CitsStore.getServices();
      if (stored && stored.length > 0) return stored;
    }
    return initialServicePillars;
  });
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = CitsStore.getCaseStudies();
      if (stored && stored.length > 0) return stored;
    }
    return initialCaseStudies;
  });
  const [landingData, setLandingData] = useState<LandingPageData>(() => {
    if (typeof window !== "undefined") {
      return CitsStore.getLandingData();
    }
    return initialLandingPageData;
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Guard against duplicate syncBackend calls from React strict mode / remounts
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    function refreshFromLocal() {
      setProducts(CitsStore.getProducts());
      setContactInfo(CitsStore.getContactInfo());
      setMessages(CitsStore.getMessages());
      setAboutData(CitsStore.getAboutData());
      setClients(CitsStore.getClients());
      setServices(CitsStore.getServices());
      setCaseStudies(CitsStore.getCaseStudies());
      setLandingData(CitsStore.getLandingData());
      setIsLiveConnected(inboxConnected);
      setIsLoaded(true);
    }

    refreshFromLocal();

    // ── 1. Initial Backend Sync ────────────────────────────────────────
    async function syncBackend() {
      // Prevent duplicate sync on React strict mode double-mount
      if (hasSyncedRef.current) return;
      hasSyncedRef.current = true;

      try {
        const [prodRes, contactRes, aboutRes, clientRes, landRes, srvRes, portRes] = await Promise.allSettled([
          citsApi.getAllProducts(),
          citsApi.getContactInfo(),
          citsApi.getAboutData(),
          citsApi.getClients(),
          citsApi.getLandingData(),
          citsApi.getServices(),
          citsApi.getPortfolio(),
        ]);

        if (prodRes.status === "fulfilled" && Array.isArray(prodRes.value) && prodRes.value.length > 0) {
          setProducts(prodRes.value);
          setStorageItem(siteConfig.storageKeys.products, prodRes.value);
        }
        if (contactRes.status === "fulfilled" && contactRes.value) {
          setContactInfo(contactRes.value);
          setStorageItem(siteConfig.storageKeys.contactInfo, contactRes.value);
        }
        if (aboutRes.status === "fulfilled" && aboutRes.value) {
          setAboutData(aboutRes.value);
          setStorageItem(siteConfig.storageKeys.about, aboutRes.value);
        }
        if (clientRes.status === "fulfilled" && Array.isArray(clientRes.value) && clientRes.value.length > 0) {
          setClients(clientRes.value);
          setStorageItem(siteConfig.storageKeys.clients, clientRes.value);
        }
        if (landRes.status === "fulfilled" && landRes.value) {
          setLandingData(landRes.value);
          setStorageItem(siteConfig.storageKeys.landing, landRes.value);
        }
        if (srvRes.status === "fulfilled" && Array.isArray(srvRes.value) && srvRes.value.length > 0) {
          setServices(srvRes.value);
          setStorageItem(siteConfig.storageKeys.services, srvRes.value);
        }
        if (portRes.status === "fulfilled" && Array.isArray(portRes.value) && portRes.value.length > 0) {
          setCaseStudies(portRes.value);
          setStorageItem(siteConfig.storageKeys.portfolio, portRes.value);
        }
      } catch (err) {
        console.warn("Backend background sync fallback:", err);
      }
    }

    syncBackend();

    window.addEventListener("cits-data-updated", refreshFromLocal);
    window.addEventListener("storage", refreshFromLocal);

    return () => {
      window.removeEventListener("cits-data-updated", refreshFromLocal);
      window.removeEventListener("storage", refreshFromLocal);
    };
  }, []);

  return {
    isLoaded,
    isLiveConnected,
    products,
    activeProducts: products.filter((p) => p.isActive),
    contactInfo,
    messages,
    aboutData,
    clients,
    services,
    caseStudies,
    activeCaseStudies: caseStudies.filter((c) => c.isActive !== false),
    landingData,
    actions: CitsStore,
  };
}

