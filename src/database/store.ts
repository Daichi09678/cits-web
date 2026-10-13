"use client";

import { useEffect, useState } from "react";
import { ProductItem, ContactInfo, ContactMessage, AboutData, ClientPartner } from "./schema";
import {
  initialProducts,
  initialContactInfo,
  initialContactMessages,
  initialAboutData,
  initialClients,
} from "./initialData";
import { siteConfig } from "@/config/siteConfig";

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
    // Trigger custom window event to synchronize across components
    window.dispatchEvent(new Event("cits-data-updated"));
  } catch (e) {
    console.error("Failed to write to localStorage", e);
  }
}

// Global Store API
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
    return newProduct;
  },
  updateProduct(id: string, updates: Partial<ProductItem>): void {
    const current = this.getProducts();
    const updated = current.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    this.saveProducts(updated);
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
    return newStatus;
  },
  deleteProduct(id: string): void {
    const current = this.getProducts();
    this.saveProducts(current.filter((p) => p.id !== id));
  },

  // CONTACT INFO
  getContactInfo(): ContactInfo {
    return getStorageItem<ContactInfo>(siteConfig.storageKeys.contactInfo, initialContactInfo);
  },
  saveContactInfo(info: ContactInfo): void {
    setStorageItem(siteConfig.storageKeys.contactInfo, info);
  },

  // CONTACT MESSAGES (INBOX)
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
    return newMsg;
  },
  updateMessageStatus(id: string, status: "unread" | "read" | "replied"): void {
    const current = this.getMessages();
    const updated = current.map((m) => (m.id === id ? { ...m, status } : m));
    this.saveMessages(updated);
  },
  deleteMessage(id: string): void {
    const current = this.getMessages();
    this.saveMessages(current.filter((m) => m.id !== id));
  },

  // ABOUT
  getAboutData(): AboutData {
    return getStorageItem<AboutData>(siteConfig.storageKeys.about, initialAboutData);
  },
  saveAboutData(data: AboutData): void {
    setStorageItem(siteConfig.storageKeys.about, data);
  },

  // CLIENTS
  getClients(): ClientPartner[] {
    return getStorageItem<ClientPartner[]>(siteConfig.storageKeys.clients, initialClients);
  },
  saveClients(clients: ClientPartner[]): void {
    setStorageItem(siteConfig.storageKeys.clients, clients);
  },

  // RESET TO DEFAULT
  resetAllToDefault(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(siteConfig.storageKeys.products);
    localStorage.removeItem(siteConfig.storageKeys.contactInfo);
    localStorage.removeItem(siteConfig.storageKeys.messages);
    localStorage.removeItem(siteConfig.storageKeys.about);
    localStorage.removeItem(siteConfig.storageKeys.clients);
    window.dispatchEvent(new Event("cits-data-updated"));
  },
};

// React Hook to subscribe to store updates
export function useCitsStore() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [messages, setMessages] = useState<ContactMessage[]>(initialContactMessages);
  const [aboutData, setAboutData] = useState<AboutData>(initialAboutData);
  const [clients, setClients] = useState<ClientPartner[]>(initialClients);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function refresh() {
      setProducts(CitsStore.getProducts());
      setContactInfo(CitsStore.getContactInfo());
      setMessages(CitsStore.getMessages());
      setAboutData(CitsStore.getAboutData());
      setClients(CitsStore.getClients());
      setIsLoaded(true);
    }

    refresh();
    window.addEventListener("cits-data-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("cits-data-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return {
    isLoaded,
    products,
    activeProducts: products.filter((p) => p.isActive),
    contactInfo,
    messages,
    aboutData,
    clients,
    actions: CitsStore,
  };
}
