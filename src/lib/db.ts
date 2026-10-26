import postgres from "postgres";
import { randomUUID } from "node:crypto";
import {
  initialProducts,
  initialContactInfo,
  initialContactMessages,
  initialAboutData,
  initialClients,
  initialLandingPageData,
  initialServicePillars,
  initialCaseStudies,
} from "@/data/initialData";
import { getMessageRetentionDays } from "@/config/inbox";
import type { HomeSectionPatch } from "@/lib/homeSections";
import type { PublicContentPage, PublicPageContent } from "@/lib/publicPageContent";
import {
  ProductItem,
  ContactInfo,
  ContactMessage,
  ConsultationDetails,
  DealStage,
  AboutData,
  ClientPartner,
  LandingPageData,
  ServicePillar,
  CaseStudyItem,
} from "@/types/schema";

// Global fallback cache and PostgreSQL singleton for Next.js App Router
declare global {
  var _citsMemoryDb:
    | {
        products: ProductItem[];
        contactInfo: ContactInfo;
        messages: ContactMessage[];
        aboutData: AboutData;
        clients: ClientPartner[];
        landingData: LandingPageData;
        services: ServicePillar[];
        portfolio: CaseStudyItem[];
        isInitialized: boolean;
      }
    | undefined;
  var _citsSqlInstance: postgres.Sql | undefined;
  var _citsDbInitialized: boolean | undefined;
  var _citsDbSchemaVersion: number | undefined;
  var _citsDbInitPromise: Promise<void> | undefined;
  // Circuit breaker DB: kalau database tidak bisa dihubungi, jangan ulangi
  // percobaan koneksi di setiap request (penyebab halaman terasa "loading lama").
  var _citsDbDownUntil: number | undefined;
  var _citsDbDownReason: string | undefined;
  var _citsDbDownWarnedAt: number | undefined;
  var _citsDbFailCount: number | undefined;
  // Versi pembungkus client (guard circuit breaker). Saat modul ini di-reload
  // HMR, singleton lama harus dibuat ulang supaya pembungkus baru terpasang.
  var _citsSqlClientVersion: number | undefined;
  // Waktu purge retensi inbox terakhir (ms) — mencegah DELETE berulang tiap request.
  var _citsLastInboxPurge: number | undefined;
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

// Naikkan nilai ini setiap kali pembungkus client berubah, agar singleton lama
// (tanpa circuit breaker) tidak dipakai ulang setelah HMR.
const DB_CLIENT_VERSION = 2;

export function getSql(): postgres.Sql | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  if (globalThis._citsSqlInstance && globalThis._citsSqlClientVersion !== DB_CLIENT_VERSION) {
    globalThis._citsSqlInstance = undefined;
  }

  if (!globalThis._citsSqlInstance) {
    try {
      globalThis._citsSqlInstance = guardSqlClient(
        postgres(dbUrl, {
          max: 5,
          idle_timeout: 30,
          connect_timeout: 5,
          ssl: dbUrl.includes("localhost") ? false : "require",
          // Aplikasi ini menjalankan migrasi DDL saat start (mis. perubahan tipe
          // created_at). Prepared statement yang di-cache per koneksi akan gagal
          // ("cached plan must not change result type") setelah tipe kolom berubah,
          // jadi prepared statement dimatikan. Beban query kecil (CMS internal).
          prepare: false,
        })
      );
      globalThis._citsSqlClientVersion = DB_CLIENT_VERSION;
    } catch (e) {
      console.error("Failed to initialize postgres client:", e);
      return null;
    }
  }
  return globalThis._citsSqlInstance;
}

// ----------------------------------------------------
// Circuit breaker koneksi database
// ----------------------------------------------------
// Masalah yang dicegah: bila DATABASE_URL salah / database mati, setiap request
// (termasuk 11 statement migrasi di ensureDbReady) mencoba koneksi ulang dan
// menggantung. Akibatnya perpindahan halaman terasa lambat sekali padahal
// kompilasi Turbopack hanya puluhan milidetik. Setelah satu kegagalan koneksi,
// query berikutnya langsung gagal cepat (fallback ke penyimpanan memori) sampai
// masa tenggang habis.

const DB_RETRY_BASE_COOLDOWN_MS = 30_000;
const DB_RETRY_MAX_COOLDOWN_MS = 300_000;

const DB_DOWN_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "28P01", // invalid_password
  "28000", // invalid_authorization_specification
  "3D000", // invalid_catalog_name (database tidak ada)
  "57P03", // cannot_connect_now
  "53300", // too_many_connections
  "08000",
  "08003",
  "08006",
]);

function looksLikeConnectionError(error: unknown): boolean {
  const code = String((error as { code?: unknown } | null)?.code ?? "");
  if (DB_DOWN_ERROR_CODES.has(code)) return true;
  const message = String((error as { message?: unknown } | null)?.message ?? "");
  return /password authentication failed|does not exist|Connection terminated|ECONNREFUSED|ENOTFOUND|getaddrinfo|timeout exceeded|connect ETIMEDOUT|Connection refused/i.test(
    message
  );
}

function dbIsDown(): boolean {
  return Date.now() < (globalThis._citsDbDownUntil ?? 0);
}

function markDbDown(error: unknown): void {
  const previousFails = globalThis._citsDbFailCount ?? 0;
  const fails = previousFails + 1;
  const cooldown = Math.min(DB_RETRY_BASE_COOLDOWN_MS * 2 ** (fails - 1), DB_RETRY_MAX_COOLDOWN_MS);

  globalThis._citsDbFailCount = fails;
  globalThis._citsDbDownUntil = Date.now() + cooldown;
  globalThis._citsDbDownReason = String((error as { message?: unknown } | null)?.message ?? error).slice(0, 200);

  const warnedAt = globalThis._citsDbDownWarnedAt ?? 0;
  if (Date.now() - warnedAt > cooldown) {
    globalThis._citsDbDownWarnedAt = Date.now();
    console.warn(
      `[db] Database tidak tersedia (${globalThis._citsDbDownReason}). ` +
        `Percobaan koneksi dihentikan ${Math.round(cooldown / 1000)}s; aplikasi memakai penyimpanan memori.`
    );
  }
}

function markDbUp(): void {
  if (globalThis._citsDbDownUntil || globalThis._citsDbFailCount) {
    globalThis._citsDbDownUntil = undefined;
    globalThis._citsDbFailCount = undefined;
    globalThis._citsDbDownReason = undefined;
    console.log("[db] Koneksi database pulih.");
  }
}

function dbDownError(): Error {
  const error = new Error(
    `Database tidak tersedia (${globalThis._citsDbDownReason ?? "tidak diketahui"}). Permintaan DB dilewati sementara.`
  );
  (error as Error & { code?: string }).code = "CITS_DB_UNAVAILABLE";
  return error;
}

// Method postgres.js yang sinkron (tidak menyentuh jaringan) harus tetap
// diteruskan apa adanya, mis. sql.json() yang dipakai untuk kolom jsonb.
const PASSTHROUGH_SQL_METHODS = new Set(["json", "array", "options", "end", "listen", "notify"]);

function guardSqlClient(raw: postgres.Sql): postgres.Sql {
  const run = (call: () => unknown): unknown => {
    if (dbIsDown()) return Promise.reject(dbDownError());

    let result: unknown;
    try {
      result = call();
    } catch (error) {
      if (looksLikeConnectionError(error)) markDbDown(error);
      throw error;
    }

    if (result && typeof (result as PromiseLike<unknown>).then === "function") {
      return Promise.resolve(result as PromiseLike<unknown>).then(
        (value) => {
          markDbUp();
          return value;
        },
        (error) => {
          if (looksLikeConnectionError(error)) markDbDown(error);
          throw error;
        }
      );
    }

    return result;
  };

  return new Proxy(raw, {
    apply: (target, thisArg, args) => run(() => Reflect.apply(target, thisArg, args)),
    get: (target, prop, receiver) => {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") return value;
      if (typeof prop === "string" && PASSTHROUGH_SQL_METHODS.has(prop)) return value.bind(target);
      return (...args: unknown[]) => run(() => Reflect.apply(value, target, args));
    },
  }) as postgres.Sql;
}

// postgres.js menuntut parameter bertipe JSONValue (punya index signature) agar
// kolom jsonb benar-benar menyimpan objek/array, bukan JSON string. Interface TS
// biasa tidak punya index signature, jadi cast-nya dipusatkan di sini.
function jsonb(sql: postgres.Sql, value: unknown) {
  return sql.json(value as any);
}

// Beberapa kolom JSONB terlanjur tersimpan sebagai JSON *string* (double-encoded)
// karena sebelumnya ditulis dengan JSON.stringify(). Helper ini menormalkannya
// saat dibaca tanpa mengubah kontrak API.
function asJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return (parsed ?? fallback) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

// Auto Schema Migration & Initial Seed (Ensures new columns exist on Cloud DB)
export async function ensureDbReady(): Promise<void> {
  const sql = getSql();
  if (!sql) return;
  // Saat circuit breaker terbuka (database mati/salah kredensial), jangan ulangi
  // 11 statement migrasi di setiap request — itu sumber utama halaman terasa lama.
  if (dbIsDown()) return;
  const schemaVersion = 5;
  if (globalThis._citsDbInitialized && globalThis._citsDbSchemaVersion === schemaVersion) return;
  if (globalThis._citsDbInitPromise) return globalThis._citsDbInitPromise;

  globalThis._citsDbInitPromise = (async () => {
    // PENTING: postgres.js mengirim query berparameter sebagai *prepared statement*,
    // dan PostgreSQL menolak beberapa perintah dalam satu prepared statement
    // (error 42601: "cannot insert multiple commands into a prepared statement").
    // Karena itu setiap DDL WAJIB dijalankan sebagai query terpisah.
    const migrations: string[] = [
      `CREATE TABLE IF NOT EXISTS public_page_content (page TEXT PRIMARY KEY CHECK (page IN ('about', 'portfolio')), data JSONB NOT NULL DEFAULT '{}'::jsonb, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
      `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS consultation_details JSONB DEFAULT '{}'::jsonb`,
      `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS product_id TEXT`,
      `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS product_requested TEXT`,
      `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS deal_stage VARCHAR(50) DEFAULT 'baru'`,
      `ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS deal_notes TEXT DEFAULT ''`,
      `ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS faqs JSONB DEFAULT '[]'::jsonb`,
      `ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS custom_services JSONB DEFAULT '[]'::jsonb`,
      `ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS announcement JSONB DEFAULT '{}'::jsonb`,
      `ALTER TABLE landing_page_data ADD COLUMN IF NOT EXISTS section_visibility JSONB DEFAULT '{}'::jsonb`,
      `ALTER TABLE landing_page_data ADD COLUMN IF NOT EXISTS products_intro JSONB DEFAULT '{}'::jsonb`,
      `ALTER TABLE landing_page_data ADD COLUMN IF NOT EXISTS clients_intro JSONB DEFAULT '{}'::jsonb`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT TRUE`,
      `ALTER TABLE clients ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT TRUE`,
    ];

    let allApplied = true;
    for (const statement of migrations) {
      try {
        await sql.unsafe(statement, [], { prepare: false });
      } catch (e: any) {
        allApplied = false;
        console.warn("DB migration schema notice:", e?.message || e);
      }
    }
    // Kolom created_at lama bertipe "timestamp without time zone" sehingga driver
    // menafsirkannya sebagai waktu lokal mesin (di WIB bergeser -7 jam).
    // Ubah ke timestamptz agar waktu simpan/baca selalu sama di mesin mana pun.
    //
    // Dijalankan lewat koneksi terpisah: ALTER TABLE mengubah tipe hasil query,
    // dan bila memakai pool utama akan membuat prepared plan yang sudah cache
    // gagal ("cached plan must not change result type").
    try {
      const [col] = await sql`
        SELECT data_type FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'contact_messages' AND column_name = 'created_at'
      `;
      if (col && col.data_type === "timestamp without time zone") {
        const dbUrl = process.env.DATABASE_URL as string;
        const migrationClient = postgres(dbUrl, {
          max: 1,
          connect_timeout: 10,
          idle_timeout: 5,
          ssl: dbUrl.includes("localhost") ? false : "require",
        });
        try {
          await migrationClient.unsafe(
            `ALTER TABLE contact_messages ALTER COLUMN created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC'`
          );
          console.log("DB migration: contact_messages.created_at -> timestamptz");
        } finally {
          await migrationClient.end({ timeout: 5 });
        }
      }
    } catch (e: any) {
      console.warn("DB migration created_at notice:", e?.message || e);
    }

    if (allApplied) {
      globalThis._citsDbInitialized = true;
      globalThis._citsDbSchemaVersion = schemaVersion;
    }
  })()
    .catch((e) => {
      // Inisialisasi DB tidak boleh menjatuhkan request: repo akan fallback ke memory.
      console.error("DB initialization error:", e);
    })
    .finally(() => {
      // Jangan pernah menyimpan promise yang gagal. Promise rejected yang di-cache
      // membuat SEMUA request berikutnya langsung gagal (500) tanpa mencoba ulang.
      globalThis._citsDbInitPromise = undefined;
    });
  return globalThis._citsDbInitPromise;
}

// ----------------------------------------------------
// Unified Repository Operations (DB with fallback to memory)
// ----------------------------------------------------

export const DbRepo = {
  async getPublicPageContent(page: PublicContentPage): Promise<Partial<PublicPageContent> | null> {
    const sql = getSql();
    if (!sql) return null;
    await ensureDbReady();
    const [row] = await sql`SELECT data FROM public_page_content WHERE page = ${page} LIMIT 1;`;
    return row ? asJson(row.data, null) : null;
  },
  async updatePublicPageContent(page: PublicContentPage, data: PublicPageContent): Promise<PublicPageContent> {
    const sql = getSql();
    if (!sql) throw new Error("Database belum dikonfigurasi.");
    await ensureDbReady();
    const [row] = await sql`
      INSERT INTO public_page_content (page, data, updated_at) VALUES (${page}, ${jsonb(sql, data)}, NOW())
      ON CONFLICT (page) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW() RETURNING data;
    `;
    if (!row) throw new Error("Konten halaman belum tersimpan.");
    return asJson(row.data, data);
  },
  // PRODUCTS
  async getAllProducts(): Promise<ProductItem[]> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`
          SELECT id, name, category, description, features, tags, icon, image, is_active, show_on_home, updated_at
          FROM products ORDER BY created_at DESC;
        `;
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          category: r.category,
          description: r.description,
          features: asJson(r.features, []),
          tags: asJson(r.tags, []),
          icon: r.icon,
          image: r.image,
          isActive: r.is_active,
          showOnHome: r.show_on_home !== false,
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
          INSERT INTO products (id, name, category, description, features, tags, icon, image, is_active, show_on_home, updated_at)
          VALUES (
            ${p.id}, ${p.name}, ${p.category}, ${p.description},
            ${jsonb(sql, p.features || [])}, ${jsonb(sql, p.tags || [])},
            ${p.icon}, ${p.image || null}, ${p.isActive}, ${p.showOnHome !== false}, ${p.updatedAt}
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
              features = ${jsonb(sql, merged.features || [])},
              tags = ${jsonb(sql, merged.tags || [])},
              icon = ${merged.icon},
              image = ${merged.image || null},
              is_active = ${merged.isActive},
              show_on_home = ${merged.showOnHome !== false},
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
    if (!sql) throw new Error("DATABASE_URL is required for persistent inbox storage");
    if (sql) {
      await ensureDbReady();
      try {
        const retentionDays = getMessageRetentionDays();
        const rows = await sql`
          SELECT id, name, email, phone, company, service_requested, product_id, product_requested, consultation_details, message, status,
                 deal_stage, deal_notes, created_at
          FROM contact_messages
          WHERE created_at >= NOW() - make_interval(days => ${retentionDays})
          ORDER BY created_at DESC;
        `;
        const mapped = rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          company: r.company,
          serviceRequested: r.service_requested,
          productId: r.product_id || undefined,
          productRequested: r.product_requested || undefined,
          consultation: asJson<ConsultationDetails | undefined>(r.consultation_details, undefined),
          message: r.message,
          status: r.status,
          dealStage: (r.deal_stage as any) || "baru",
          dealNotes: r.deal_notes || "",
          createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        }));
        if (mapped.length > 0) {
          memoryDb.messages = mapped;
        }
        return mapped;
      } catch (e) {
        console.error("DB Error getMessages:", e);
        throw e;
      }
    }
    return memoryDb.messages;
  },

  async addMessage(
    msg: Omit<ContactMessage, "id" | "status" | "createdAt"> & { id?: string }
  ): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...msg,
      id: msg.id || "msg-" + randomUUID(),
      status: "unread",
      dealStage: msg.dealStage || "baru",
      dealNotes: msg.dealNotes || "",
      createdAt: new Date().toISOString(),
    };

    const sql = getSql();
    if (!sql) throw new Error("DATABASE_URL is required for persistent inbox storage");
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO contact_messages (id, name, company, email, phone, service_requested, product_id, product_requested, consultation_details, message, status, deal_stage, deal_notes, created_at)
          VALUES (
            ${newMsg.id}, ${newMsg.name}, ${newMsg.company}, ${newMsg.email},
            ${newMsg.phone}, ${newMsg.serviceRequested}, ${newMsg.productId || null}, ${newMsg.productRequested || null}, ${jsonb(sql, newMsg.consultation || {})}, ${newMsg.message},
            ${newMsg.status}, ${newMsg.dealStage || "baru"}, ${newMsg.dealNotes || ""}, ${newMsg.createdAt}
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            company = EXCLUDED.company,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            service_requested = EXCLUDED.service_requested,
            product_id = EXCLUDED.product_id,
            product_requested = EXCLUDED.product_requested,
            consultation_details = EXCLUDED.consultation_details,
            message = EXCLUDED.message;
        `;
      } catch (e) {
        console.error("DB Error addMessage:", e);
        throw e;
      }
    }

    memoryDb.messages = [newMsg, ...memoryDb.messages.filter((m) => m.id !== newMsg.id)];
    return newMsg;
  },

  async updateMessageStatus(id: string, status: "unread" | "read" | "replied"): Promise<boolean> {
    const sql = getSql();
    if (!sql) throw new Error("DATABASE_URL is required for persistent inbox storage");
    if (sql) {
      try {
        await sql`UPDATE contact_messages SET status = ${status} WHERE id = ${id};`;
      } catch (e) {
        console.error("DB Error updateMessageStatus:", e);
        throw e;
      }
    }
    memoryDb.messages = memoryDb.messages.map((m) => (m.id === id ? { ...m, status } : m));
    return true;
  },

  async updateMessageStage(id: string, stage: DealStage, notes?: string): Promise<boolean> {
    const sql = getSql();
    if (!sql) throw new Error("DATABASE_URL is required for persistent inbox storage");
    if (sql) {
      await ensureDbReady();
      try {
        if (notes !== undefined) {
          await sql`UPDATE contact_messages SET deal_stage = ${stage}, deal_notes = ${notes} WHERE id = ${id};`;
        } else {
          await sql`UPDATE contact_messages SET deal_stage = ${stage} WHERE id = ${id};`;
        }
      } catch (e) {
        console.error("DB Error updateMessageStage:", e);
        throw e;
      }
    }
    memoryDb.messages = memoryDb.messages.map((m) =>
      m.id === id ? { ...m, dealStage: stage, ...(notes !== undefined ? { dealNotes: notes } : {}) } : m
    );
    return true;
  },

  async deleteMessage(id: string): Promise<boolean> {
    const sql = getSql();
    if (!sql) throw new Error("DATABASE_URL is required for persistent inbox storage");
    if (sql) {
      await ensureDbReady();
      try {
        await sql`DELETE FROM contact_messages WHERE id = ${id};`;
      } catch (e) {
        console.error("DB Error deleteMessage:", e);
        throw e;
      }
    }
    memoryDb.messages = memoryDb.messages.filter((m) => m.id !== id);
    return true;
  },

  /**
   * Hapus permanen pesan yang lebih tua dari `retentionDays` hari.
   * Mengembalikan jumlah pesan yang dihapus.
   */
  async purgeExpiredMessages(retentionDays: number = getMessageRetentionDays()): Promise<number> {
    const days = Number.isFinite(retentionDays) && retentionDays > 0 ? Math.floor(retentionDays) : 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

    // Cache in-memory ikut dibersihkan, termasuk saat DB tidak tersedia.
    const before = memoryDb.messages.length;
    memoryDb.messages = memoryDb.messages.filter((m) => {
      const time = new Date(m.createdAt).getTime();
      return Number.isFinite(time) ? time >= cutoff : true;
    });
    let deleted = before - memoryDb.messages.length;

    const sql = getSql();
    if (!sql) return deleted;
    await ensureDbReady();
    try {
      const rows = await sql`
        DELETE FROM contact_messages
        WHERE created_at < NOW() - make_interval(days => ${days})
        RETURNING id;
      `;
      deleted = Math.max(deleted, rows.length);
    } catch (e) {
      console.error("DB Error purgeExpiredMessages:", e);
    }
    return deleted;
  },

  /**
   * Versi hemat: paling sering berjalan sekali per `minIntervalMs` per proses.
   * Dipanggil setiap inbox dibuka, sehingga pembersihan tetap jalan tanpa cron.
   */
  async purgeExpiredMessagesIfDue(minIntervalMs: number = 60 * 1000): Promise<number> {
    const now = Date.now();
    const last = globalThis._citsLastInboxPurge;
    if (last && now - last < minIntervalMs) return 0;
    globalThis._citsLastInboxPurge = now;
    return this.purgeExpiredMessages();
  },

  async deleteMessages(ids: string[]): Promise<boolean> {
    if (!ids || ids.length === 0) return true;
    const sql = getSql();
    if (!sql) throw new Error("DATABASE_URL is required for persistent inbox storage");
    if (sql) {
      await ensureDbReady();
      try {
        await sql`DELETE FROM contact_messages WHERE id = ANY(${ids});`;
      } catch (e) {
        console.error("DB Error deleteMessages:", e);
        throw e;
      }
    }
    const idSet = new Set(ids);
    memoryDb.messages = memoryDb.messages.filter((m) => !idSet.has(m.id));
    return true;
  },

  // CONTACT INFO
  async getContactInfo(): Promise<ContactInfo> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`
          SELECT address, phone, email, working_hours, maps_url, emergency_phone,
                 faqs, custom_services, announcement
          FROM contact_info WHERE id = 'default' LIMIT 1;
        `;
        if (rows.length > 0) {
          const r = rows[0];
          const faqs = asJson<ContactInfo["faqs"]>(r.faqs, initialContactInfo.faqs);
          const customServices = asJson<ContactInfo["customServices"]>(
            r.custom_services,
            initialContactInfo.customServices
          );
          const announcement = asJson<ContactInfo["announcement"]>(r.announcement, initialContactInfo.announcement);
          return {
            address: r.address,
            phone: r.phone,
            email: r.email,
            workingHours: r.working_hours,
            mapsUrl: r.maps_url || undefined,
            emergencyPhone: r.emergency_phone || undefined,
            faqs: Array.isArray(faqs) && faqs.length > 0 ? faqs : initialContactInfo.faqs,
            customServices:
              Array.isArray(customServices) && customServices.length > 0
                ? customServices
                : initialContactInfo.customServices,
            announcement:
              announcement && typeof announcement === "object" ? announcement : initialContactInfo.announcement,
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
          INSERT INTO contact_info (id, company_name, address, phone, email, working_hours, maps_url, emergency_phone, faqs, custom_services, announcement, updated_at)
          VALUES (
            'default', 'CV CITS Indonesia', ${info.address}, ${info.phone},
            ${info.email}, ${info.workingHours}, ${info.mapsUrl || null},
            ${info.emergencyPhone || null},
            ${jsonb(sql, info.faqs || initialContactInfo.faqs || [])},
            ${jsonb(sql, info.customServices || initialContactInfo.customServices || [])},
            ${jsonb(sql, info.announcement || initialContactInfo.announcement || {})}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            address = EXCLUDED.address,
            phone = EXCLUDED.phone,
            email = EXCLUDED.email,
            working_hours = EXCLUDED.working_hours,
            maps_url = EXCLUDED.maps_url,
            emergency_phone = EXCLUDED.emergency_phone,
            faqs = EXCLUDED.faqs,
            custom_services = EXCLUDED.custom_services,
            announcement = EXCLUDED.announcement,
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
        const rows = await sql`
          SELECT title, subtitle, story, vision, mission, core_values, stats
          FROM about_data WHERE id = 'default' LIMIT 1;
        `;
        if (rows.length > 0) {
          const r = rows[0];
          return {
            title: r.title,
            subtitle: r.subtitle,
            story: r.story,
            vision: r.vision,
            mission: asJson(r.mission, memoryDb.aboutData.mission),
            coreValues: asJson(r.core_values, memoryDb.aboutData.coreValues),
            stats: asJson(r.stats, memoryDb.aboutData.stats),
          } as AboutData;
        }
      } catch (e) {
        console.error("DB Error getAboutData:", e);
      }
    }
    return memoryDb.aboutData;
  },

  async updateAboutData(data: AboutData): Promise<AboutData> {
    const sql = getSql();
    if (!sql) throw new Error("Database belum dikonfigurasi. Profil perusahaan belum dapat disimpan.");
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO about_data (id, title, subtitle, story, vision, mission, core_values, stats, updated_at)
          VALUES (
            'default', ${data.title}, ${data.subtitle}, ${data.story}, ${data.vision},
            ${jsonb(sql, data.mission || [])},
            ${jsonb(sql, data.coreValues || [])},
            ${jsonb(sql, data.stats || [])}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            subtitle = EXCLUDED.subtitle,
            story = EXCLUDED.story,
            vision = EXCLUDED.vision,
            mission = EXCLUDED.mission,
            core_values = EXCLUDED.core_values,
            stats = EXCLUDED.stats,
            updated_at = NOW();
        `;
      } catch (e) {
        console.error("DB Error updateAboutData:", e);
        throw e;
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
        const rows = await sql`
          SELECT id, name, logo, category, is_active, show_on_home
          FROM clients ORDER BY created_at ASC;
        `;
        return rows.map((r: any) => ({
          id: r.id,
          name: r.name,
          logo: r.logo,
          category: r.category,
          isActive: r.is_active,
          showOnHome: r.show_on_home !== false,
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
          INSERT INTO clients (id, name, logo, category, is_active, show_on_home)
          VALUES (${c.id}, ${c.name}, ${c.logo}, ${c.category}, ${c.isActive}, ${c.showOnHome !== false});
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
          SET name = ${merged.name}, logo = ${merged.logo}, category = ${merged.category}, is_active = ${merged.isActive},
              show_on_home = ${merged.showOnHome !== false}
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
  async patchLandingData(patch: HomeSectionPatch): Promise<LandingPageData> {
    const sql = getSql();
    if (!sql) throw new Error("Database belum dikonfigurasi. Isi beranda belum dapat disimpan.");
    await ensureDbReady();
    const base = initialLandingPageData;
    // Merge only the submitted fields in PostgreSQL so independent editors cannot overwrite each other.
    const [row] = await sql`
      INSERT INTO landing_page_data (id, hero, highlights, services_intro, products_intro, clients_intro, section_visibility, cta, updated_at)
      VALUES ('default',
        ${jsonb(sql, { ...base.hero, ...patch.hero })}, ${jsonb(sql, patch.highlights ?? base.highlights)},
        ${jsonb(sql, { ...base.servicesIntro, ...patch.servicesIntro })},
        ${jsonb(sql, { ...base.productsIntro, ...patch.productsIntro })},
        ${jsonb(sql, { ...base.clientsIntro, ...patch.clientsIntro })},
        ${jsonb(sql, { ...base.sectionVisibility, ...patch.sectionVisibility })},
        ${jsonb(sql, { ...base.cta, ...patch.cta })}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        hero = COALESCE(landing_page_data.hero, '{}'::jsonb) || ${jsonb(sql, patch.hero || {})},
        highlights = CASE WHEN ${patch.highlights !== undefined} THEN EXCLUDED.highlights ELSE landing_page_data.highlights END,
        services_intro = COALESCE(landing_page_data.services_intro, '{}'::jsonb) || ${jsonb(sql, patch.servicesIntro || {})},
        products_intro = COALESCE(landing_page_data.products_intro, '{}'::jsonb) || ${jsonb(sql, patch.productsIntro || {})},
        clients_intro = COALESCE(landing_page_data.clients_intro, '{}'::jsonb) || ${jsonb(sql, patch.clientsIntro || {})},
        section_visibility = COALESCE(landing_page_data.section_visibility, '{}'::jsonb) || ${jsonb(sql, patch.sectionVisibility || {})},
        cta = COALESCE(landing_page_data.cta, '{}'::jsonb) || ${jsonb(sql, patch.cta || {})}, updated_at = NOW()
      RETURNING hero, highlights, services_intro, products_intro, clients_intro, section_visibility, cta;
    `;
    if (!row) throw new Error("Isi beranda belum tersimpan. Silakan coba kembali.");
    const updated: LandingPageData = {
      ...base,
      hero: { ...base.hero, ...asJson(row.hero, {}) },
      highlights: asJson(row.highlights, base.highlights),
      servicesIntro: { ...base.servicesIntro, ...asJson(row.services_intro, {}) },
      productsIntro: { ...base.productsIntro, ...asJson(row.products_intro, {}) },
      clientsIntro: { ...base.clientsIntro, ...asJson(row.clients_intro, {}) },
      sectionVisibility: { ...base.sectionVisibility!, ...asJson(row.section_visibility, {}) },
      cta: { ...base.cta, ...asJson(row.cta, {}) },
      updatedAt: new Date().toISOString(),
    };
    memoryDb.landingData = updated;
    return updated;
  },

  async getLandingData(): Promise<LandingPageData> {
    const sql = getSql();
    if (sql) {
      await ensureDbReady();
      try {
        const rows = await sql`
          SELECT hero, highlights, services_intro, products_intro, clients_intro,
                 section_visibility, cta
          FROM landing_page_data WHERE id = 'default' LIMIT 1;
        `;
        if (rows.length > 0) {
          const r = rows[0];
          return {
            ...memoryDb.landingData,
            hero: asJson(r.hero, memoryDb.landingData.hero),
            highlights: asJson(r.highlights, memoryDb.landingData.highlights),
            servicesIntro: asJson(r.services_intro, memoryDb.landingData.servicesIntro),
            productsIntro: asJson(r.products_intro, memoryDb.landingData.productsIntro),
            clientsIntro: asJson(r.clients_intro, memoryDb.landingData.clientsIntro),
            sectionVisibility: asJson(r.section_visibility, memoryDb.landingData.sectionVisibility),
            cta: asJson(r.cta, memoryDb.landingData.cta),
          } as LandingPageData;
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
          INSERT INTO landing_page_data (
            id, hero, highlights, services_intro, products_intro, clients_intro,
            section_visibility, cta, updated_at
          )
          VALUES (
            'default',
            ${jsonb(sql, updated.hero || {})},
            ${jsonb(sql, updated.highlights || [])},
            ${jsonb(sql, updated.servicesIntro || {})},
            ${jsonb(sql, updated.productsIntro || {})},
            ${jsonb(sql, updated.clientsIntro || {})},
            ${jsonb(sql, updated.sectionVisibility || {})},
            ${jsonb(sql, updated.cta || {})}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            hero = EXCLUDED.hero,
            highlights = EXCLUDED.highlights,
            services_intro = EXCLUDED.services_intro,
            products_intro = EXCLUDED.products_intro,
            clients_intro = EXCLUDED.clients_intro,
            section_visibility = EXCLUDED.section_visibility,
            cta = EXCLUDED.cta,
            updated_at = NOW();
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
        if (rows.length > 0) {
          const list = asJson<ServicePillar[]>(rows[0].data, []);
          if (Array.isArray(list) && list.length > 0) return list;
        }
      } catch (e) {
        console.error("DB Error getServices:", e);
      }
    }
    return memoryDb.services;
  },

  async updateServices(data: ServicePillar[]): Promise<ServicePillar[]> {
    const sql = getSql();
    if (!sql) throw new Error("Database belum dikonfigurasi. Layanan belum dapat disimpan.");
    if (sql) {
      await ensureDbReady();
      try {
        await sql`
          INSERT INTO services_data (id, data, updated_at)
          VALUES ('default', ${jsonb(sql, data)}, NOW())
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
        `;
      } catch (e) {
        console.error("DB Error updateServices:", e);
        throw e;
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
        if (rows.length > 0) {
          const list = asJson<CaseStudyItem[]>(rows[0].data, []);
          if (Array.isArray(list) && list.length > 0) return list;
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
          VALUES ('default', ${jsonb(sql, data)}, NOW())
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
