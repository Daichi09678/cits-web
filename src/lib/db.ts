import postgres from "postgres";
import {
  initialProducts,
  initialContactInfo,
  initialContactMessages,
  initialAboutData,
  initialClients,
  initialLandingPageData,
  initialServicePillars,
  initialCaseStudies,
} from "@/database/initialData";
import {
  ProductItem,
  ContactInfo,
  ContactMessage,
  AboutData,
  ClientPartner,
  LandingPageData,
  ServicePillar,
  CaseStudyItem,
} from "@/database/schema";

// Global fallback cache and PostgreSQL singleton for Next.js App Router
declare global {
  // eslint-disable-next-line no-var
  var _citsMemoryDb: {
    products: ProductItem[];
    contactInfo: ContactInfo;
    messages: ContactMessage[];
    aboutData: AboutData;
    clients: ClientPartner[];
    landingData: LandingPageData;
    services: ServicePillar[];
    portfolio: CaseStudyItem[];
    isInitialized: boolean;
  } | undefined;
  // eslint-disable-next-line no-var
  var _citsSqlInstance: postgres.Sql | undefined;
  // eslint-disable-next-line no-var
  var _citsDbInitialized: boolean | undefined;
  // eslint-disable-next-line no-var
  var _citsDbInitPromise: Promise<void> | undefined;
}

if (!globalThis._citsMemoryDb) {
  globalThis._citsMemoryDb = {
    products: [...initialProducts],
    contactInfo: { ...initialContactInfo },
    messages: [...initialContactMessages],
    aboutData: { ...initialAboutData },
    clients: [...initialClients],
    landingData: { ...initialLandingPageData },
    services: [...initialServicePillars],
    portfolio: [...initialCaseStudies],
    isInitialized: false,
  };
}

const memoryDb = globalThis._citsMemoryDb;

export function getSql(): postgres.Sql | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  if (!globalThis._citsSqlInstance) {
    try {
      globalThis._citsSqlInstance = postgres(dbUrl, {
        max: 5,
        idle_timeout: 30,
        connect_timeout: 10,
        ssl: dbUrl.includes("localhost") ? false : "require",
      });
    } catch (e) {
      console.error("Failed to initialize postgres client:", e);
      return null;
    }
  }
  return globalThis._citsSqlInstance;
}

// Auto Schema Migration & Initial Seed (Tables are permanently provisioned on Neon Cloud DB)
export async function ensureDbReady(): Promise<void> {
  return;
}

// ----------------------------------------------------
// Unified Repository Operations (DB with fallback to memory)
// ----------------------------------------------------

export const DbRepo = {
  // PRODUCTS
  async getAllProducts(): Promise<ProductItem[]> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`SELECT * FROM products ORDER BY created_at DESC;`;
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          category: r.category,
          description: r.description,
          features: r.features || [],
          tags: r.tags || [],
          icon: r.icon,
          image: r.image,
          isActive: r.is_active,
          updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
        }));
      } catch (e) {
        console.error("DB Error getAllProducts:", e);
      }
    }
    return memoryDb.products;
  },

  async getActiveProducts(): Promise<ProductItem[]> {
    const all = await this.getAllProducts();
    return all.filter((p) => p.isActive);
  },

  async getProductById(id: string): Promise<ProductItem | null> {
    const all = await this.getAllProducts();
    return all.find((p) => p.id === id) || null;
  },

  async createProduct(p: ProductItem): Promise<ProductItem> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO products (id, name, category, description, features, tags, icon, image, is_active, updated_at)
          VALUES (
            ${p.id}, ${p.name}, ${p.category}, ${p.description},
            ${JSON.stringify(p.features)}, ${JSON.stringify(p.tags)},
            ${p.icon}, ${p.image || null}, ${p.isActive}, ${p.updatedAt}
          );
        `;
      } catch (e) {
        console.error("DB Error createProduct:", e);
      }
    }
    memoryDb.products = [p, ...memoryDb.products.filter((x) => x.id !== p.id)];
    return p;
  },

  async updateProduct(id: string, updates: Partial<ProductItem>): Promise<ProductItem | null> {
    const sql = getSql();
    const current = await this.getProductById(id);
    if (!current) return null;
    const merged: ProductItem = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          UPDATE products
          SET name = ${merged.name},
              category = ${merged.category},
              description = ${merged.description},
              features = ${JSON.stringify(merged.features)},
              tags = ${JSON.stringify(merged.tags)},
              icon = ${merged.icon},
              image = ${merged.image || null},
              is_active = ${merged.isActive},
              updated_at = ${merged.updatedAt}
          WHERE id = ${id};
        `;
      } catch (e) {
        console.error("DB Error updateProduct:", e);
      }
    }
    memoryDb.products = memoryDb.products.map((p) => (p.id === id ? merged : p));
    return merged;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`DELETE FROM products WHERE id = ${id};`;
      } catch (e) {
        console.error("DB Error deleteProduct:", e);
      }
    }
    memoryDb.products = memoryDb.products.filter((p) => p.id !== id);
    return true;
  },

  // CONTACT MESSAGES
  async getMessages(): Promise<ContactMessage[]> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`SELECT * FROM contact_messages ORDER BY created_at DESC;`;
        const mapped = rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          company: r.company,
          serviceRequested: r.service_requested,
          message: r.message,
          status: r.status,
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        }));
        if (mapped.length > 0) {
          memoryDb.messages = mapped;
        }
        return mapped;
      } catch (e) {
        console.error("DB Error getMessages:", e);
      }
    }
    return memoryDb.messages;
  },

  async addMessage(msg: Omit<ContactMessage, "status" | "createdAt"> & { id?: string }): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: msg.id || "msg-" + Date.now(),
      status: "unread",
      createdAt: new Date().toISOString(),
    };

    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO contact_messages (id, name, company, email, phone, service_requested, message, status, created_at)
          VALUES (
            ${newMsg.id}, ${newMsg.name}, ${newMsg.company}, ${newMsg.email},
            ${newMsg.phone}, ${newMsg.serviceRequested}, ${newMsg.message},
            ${newMsg.status}, ${newMsg.createdAt}
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            company = EXCLUDED.company,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            service_requested = EXCLUDED.service_requested,
            message = EXCLUDED.message;
        `;
      } catch (e) {
        console.error("DB Error addMessage:", e);
      }
    }

    memoryDb.messages = [newMsg, ...memoryDb.messages.filter((m) => m.id !== newMsg.id)];
    return newMsg;
  },

  async updateMessageStatus(id: string, status: "unread" | "read" | "replied"): Promise<boolean> {
    const sql = getSql();
    if (sql) {
      try {
        await sql`UPDATE contact_messages SET status = ${status} WHERE id = ${id};`;
      } catch (e) {
        console.error("DB Error updateMessageStatus:", e);
      }
    }
    memoryDb.messages = memoryDb.messages.map((m) => (m.id === id ? { ...m, status } : m));
    return true;
  },

  async deleteMessage(id: string): Promise<boolean> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`DELETE FROM contact_messages WHERE id = ${id};`;
      } catch (e) {
        console.error("DB Error deleteMessage:", e);
      }
    }
    memoryDb.messages = memoryDb.messages.filter((m) => m.id !== id);
    return true;
  },

  // CONTACT INFO
  async getContactInfo(): Promise<ContactInfo> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`SELECT * FROM contact_info WHERE id = 'default' LIMIT 1;`;
        if (rows.length > 0) {
          const r = rows[0];
          return {
            address: r.address,
            phone: r.phone,
            email: r.email,
            workingHours: r.working_hours,
            mapsUrl: r.maps_url || undefined,
            emergencyPhone: r.emergency_phone || undefined,
          };
        }
      } catch (e) {
        console.error("DB Error getContactInfo:", e);
      }
    }
    return memoryDb.contactInfo;
  },

  async updateContactInfo(info: ContactInfo): Promise<ContactInfo> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO contact_info (id, company_name, address, phone, email, working_hours, maps_url, emergency_phone, updated_at)
          VALUES (
            'default', 'CV CITS Indonesia', ${info.address}, ${info.phone},
            ${info.email}, ${info.workingHours}, ${info.mapsUrl || null},
            ${info.emergencyPhone || null}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            address = EXCLUDED.address,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            working_hours = EXCLUDED.working_hours,
            maps_url = EXCLUDED.maps_url,
            emergency_phone = EXCLUDED.emergency_phone,
            updated_at = NOW();
        `;
      } catch (e) {
        console.error("DB Error updateContactInfo:", e);
      }
    }
    memoryDb.contactInfo = { ...info };
    return info;
  },

  // ABOUT DATA
  async getAboutData(): Promise<AboutData> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`SELECT data FROM about_data WHERE id = 'default' LIMIT 1;`;
        if (rows.length > 0 && rows[0].data) {
          return rows[0].data as AboutData;
        }
      } catch (e) {
        console.error("DB Error getAboutData:", e);
      }
    }
    return memoryDb.aboutData;
  },

  async updateAboutData(data: AboutData): Promise<AboutData> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO about_data (id, data, updated_at)
          VALUES ('default', ${JSON.stringify(data)}, NOW())
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
        `;
      } catch (e) {
        console.error("DB Error updateAboutData:", e);
      }
    }
    memoryDb.aboutData = { ...data };
    return data;
  },

  // CLIENTS
  async getClients(): Promise<ClientPartner[]> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`SELECT * FROM clients ORDER BY created_at ASC;`;
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          logo: r.logo,
          category: r.category,
          isActive: r.is_active,
        }));
      } catch (e) {
        console.error("DB Error getClients:", e);
      }
    }
    return memoryDb.clients;
  },

  async createClient(c: ClientPartner): Promise<ClientPartner> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO clients (id, name, logo, category, is_active)
          VALUES (${c.id}, ${c.name}, ${c.logo}, ${c.category}, ${c.isActive});
        `;
      } catch (e) {
        console.error("DB Error createClient:", e);
      }
    }
    memoryDb.clients = [c, ...memoryDb.clients];
    return c;
  },

  async updateClient(id: string, updates: Partial<ClientPartner>): Promise<ClientPartner | null> {
    const clients = await this.getClients();
    const current = clients.find((c) => c.id === id);
    if (!current) return null;
    const merged = { ...current, ...updates };

    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          UPDATE clients
          SET name = ${merged.name}, logo = ${merged.logo}, category = ${merged.category}, is_active = ${merged.isActive}
          WHERE id = ${id};
        `;
      } catch (e) {
        console.error("DB Error updateClient:", e);
      }
    }
    memoryDb.clients = memoryDb.clients.map((c) => (c.id === id ? merged : c));
    return merged;
  },

  async deleteClient(id: string): Promise<boolean> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`DELETE FROM clients WHERE id = ${id};`;
      } catch (e) {
        console.error("DB Error deleteClient:", e);
      }
    }
    memoryDb.clients = memoryDb.clients.filter((c) => c.id !== id);
    return true;
  },

  // LANDING PAGE DATA (HERO, HIGHLIGHTS, SERVICES, CTA & SECTION VISIBILITY)
  async getLandingData(): Promise<LandingPageData> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`SELECT data FROM landing_page_data WHERE id = 'default' LIMIT 1;`;
        if (rows.length > 0 && rows[0].data) {
          return rows[0].data as LandingPageData;
        }
      } catch (e) {
        console.error("DB Error getLandingData:", e);
      }
    }
    return memoryDb.landingData;
  },

  async updateLandingData(data: LandingPageData): Promise<LandingPageData> {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO landing_page_data (id, data, updated_at)
          VALUES ('default', ${JSON.stringify(updated)}, NOW())
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
        `;
      } catch (e) {
        console.error("DB Error updateLandingData:", e);
      }
    }
    memoryDb.landingData = updated;
    return updated;
  },

  // SERVICES PILLARS
  async getServices(): Promise<ServicePillar[]> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`SELECT data FROM services_data WHERE id = 'default' LIMIT 1;`;
        if (rows.length > 0 && rows[0].data) {
          return rows[0].data as ServicePillar[];
        }
      } catch (e) {
        console.error("DB Error getServices:", e);
      }
    }
    return memoryDb.services;
  },

  async updateServices(data: ServicePillar[]): Promise<ServicePillar[]> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO services_data (id, data, updated_at)
          VALUES ('default', ${JSON.stringify(data)}, NOW())
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
        `;
      } catch (e) {
        console.error("DB Error updateServices:", e);
      }
    }
    memoryDb.services = data;
    return data;
  },

  // PORTFOLIO / CASE STUDIES
  async getPortfolio(): Promise<CaseStudyItem[]> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`SELECT data FROM portfolio_data WHERE id = 'default' LIMIT 1;`;
        if (rows.length > 0 && rows[0].data) {
          return rows[0].data as CaseStudyItem[];
        }
      } catch (e) {
        console.error("DB Error getPortfolio:", e);
      }
    }
    return memoryDb.portfolio;
  },

  async updatePortfolio(data: CaseStudyItem[]): Promise<CaseStudyItem[]> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO portfolio_data (id, data, updated_at)
          VALUES ('default', ${JSON.stringify(data)}, NOW())
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
        `;
      } catch (e) {
        console.error("DB Error updatePortfolio:", e);
      }
    }
    memoryDb.portfolio = data;
    return data;
  },
};
