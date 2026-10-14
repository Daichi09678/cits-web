"use client";

import { useEffect, useState } from "react";
import {
  ProductItem,
  ContactInfo,
  ContactMessage,
  AboutData,
  ClientPartner,
  LandingPageData,
  ServicePillar,
} from "./schema";
import {
  initialProducts,
  initialContactInfo,
  initialContactMessages,
  initialAboutData,
  initialClients,
  initialLandingPageData,
  initialServicePillars,
} from "./initialData";
import { siteConfig } from "@/config/siteConfig";
import { citsApi } from "@/lib/api";
import { playNewMessageSound } from "@/lib/audio";

// Helper safe JSON parse & write
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

// Global Store API with Optimistic UI & Backend Synchronization
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
    return getStorageItem<ContactMessage[]>(siteConfig.storageKeys.messages, initialContactMessages);
  },
  saveMessages(msgs: ContactMessage[]): void {
    setStorageItem(siteConfig.storageKeys.messages, msgs);
  },
  addMessage(msg: Omit<ContactMessage, "id" | "status" | "createdAt">): ContactMessage {
    const current = this.getMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: "msg-" + Date.now(),
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    this.saveMessages([newMsg, ...current]);
    citsApi.sendMessage(msg).catch((err) => console.warn("Sync send message error:", err));
    return newMsg;
  },
  updateMessageStatus(id: string, status: "unread" | "read" | "replied"): void {
    const current = this.getMessages();
    const updated = current.map((m) => (m.id === id ? { ...m, status } : m));
    this.saveMessages(updated);
    citsApi.updateMessageStatus(id, status).catch((err) => console.warn("Sync msg status error:", err));
  },
  deleteMessage(id: string): void {
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
    window.dispatchEvent(new Event("cits-data-updated"));
  },
};

// React Hook to subscribe to store updates and background sync with Central API + Realtime SSE Stream
export function useCitsStore() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [messages, setMessages] = useState<ContactMessage[]>(initialContactMessages);
  const [aboutData, setAboutData] = useState<AboutData>(initialAboutData);
  const [clients, setClients] = useState<ClientPartner[]>(initialClients);
  const [services, setServices] = useState<ServicePillar[]>(initialServicePillars);
  const [landingData, setLandingData] = useState<LandingPageData>(initialLandingPageData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  useEffect(() => {
    function refreshFromLocal() {
      setProducts(CitsStore.getProducts());
      setContactInfo(CitsStore.getContactInfo());
      setMessages(CitsStore.getMessages());
      setAboutData(CitsStore.getAboutData());
      setClients(CitsStore.getClients());
      setServices(CitsStore.getServices());
      setLandingData(CitsStore.getLandingData());
      setIsLoaded(true);
    }

    refreshFromLocal();

    // 1. Initial Sync with Central Backend REST API
    async function syncBackend() {
      try {
        const [prodRes, contactRes, aboutRes, clientRes, msgRes, landRes] = await Promise.allSettled([
          citsApi.getAllProducts(),
          citsApi.getContactInfo(),
          citsApi.getAboutData(),
          citsApi.getClients(),
          citsApi.getMessages(),
          citsApi.getLandingData(),
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
        if (msgRes.status === "fulfilled" && Array.isArray(msgRes.value) && msgRes.value.length > 0) {
          setMessages(msgRes.value);
          setStorageItem(siteConfig.storageKeys.messages, msgRes.value);
        }
        if (landRes.status === "fulfilled" && landRes.value) {
          setLandingData(landRes.value);
          setStorageItem(siteConfig.storageKeys.landing, landRes.value);
        }
      } catch (err) {
        console.warn("Backend background sync fallback:", err);
      }
    }

    syncBackend();

    // 2. Realtime SSE Stream for Live Inbox & Consultations
    let eventSource: EventSource | null = null;
    let reconnectTimeout: any = null;

    function connectSSE() {
      try {
        const streamUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api") + "/messages/stream";
        eventSource = new EventSource(streamUrl);

        eventSource.onopen = () => {
          setIsLiveConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "new_message" && data.message) {
              const newMsg = data.message as ContactMessage;
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                const nextList = [newMsg, ...prev];
                setStorageItem(siteConfig.storageKeys.messages, nextList);
                return nextList;
              });

              // Play subtle sound and notify admin in realtime
              playNewMessageSound();
              window.dispatchEvent(new CustomEvent("cits-realtime-message", { detail: newMsg }));
            }
          } catch (e) {
            // keepalive or non-json message
          }
        };

        eventSource.onerror = () => {
          setIsLiveConnected(false);
          eventSource?.close();
          // Reconnect in 4 seconds
          reconnectTimeout = setTimeout(connectSSE, 4000);
        };
      } catch (err) {
        setIsLiveConnected(false);
      }
    }

    connectSSE();

    // 3. Fallback Periodic Polling (every 6 seconds) to guarantee 100% reliable inbox sync
    const pollInterval = setInterval(async () => {
      try {
        const latestMsgs = await citsApi.getMessages();
        if (Array.isArray(latestMsgs) && latestMsgs.length > 0) {
          setMessages((current) => {
            const currentIds = new Set(current.map((m) => m.id));
            const brandNew = latestMsgs.filter((m: ContactMessage) => !currentIds.has(m.id));

            if (brandNew.length > 0) {
              // Trigger realtime notification for the newest message found
              playNewMessageSound();
              window.dispatchEvent(new CustomEvent("cits-realtime-message", { detail: brandNew[0] }));
              setStorageItem(siteConfig.storageKeys.messages, latestMsgs);
              return latestMsgs;
            }
            return current;
          });
        }
      } catch {
        // Polling silent catch
      }
    }, 6000);

    window.addEventListener("cits-data-updated", refreshFromLocal);
    window.addEventListener("storage", refreshFromLocal);

    return () => {
      window.removeEventListener("cits-data-updated", refreshFromLocal);
      window.removeEventListener("storage", refreshFromLocal);
      clearInterval(pollInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSource) eventSource.close();
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
    landingData,
    actions: CitsStore,
  };
}
