import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { canPerformAction, type PageKey, type PagePermissions, type PermissionAction } from "./internalAccess";
import { findInternalAccountById } from "./internalAccountsServer";

/**
 * Token admin bertanda tangan HMAC. Payload memuat role agar route server
 * dapat membedakan Superadmin dan Admin Internal, bukan hanya mengecek
 * keberadaan token di header.
 */
export interface AdminTokenPayload {
  sub: string;
  email: string;
  name: string;
  role: "superadmin" | "internal";
  pageAccess?: PageKey[];
  permissions?: PagePermissions;
  exp: number;
}

const TOKEN_PREFIX = "cits_admin_jwt_";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;
const SECRET = process.env.ADMIN_AUTH_SECRET || process.env.DATABASE_URL || "cits-local-dev-secret-change-me";

function sign(data: string): string {
  return createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function issueAdminToken(input: Omit<AdminTokenPayload, "exp">): string {
  const payload: AdminTokenPayload = { ...input, exp: Date.now() + TOKEN_TTL_MS };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${TOKEN_PREFIX}${body}.${sign(body)}`;
}

export function verifyAdminToken(request: Request): AdminTokenPayload | null {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ")) return null;

  const token = authorization.slice("Bearer ".length).trim();
  if (!token.startsWith(TOKEN_PREFIX)) return null;

  const raw = token.slice(TOKEN_PREFIX.length);
  const [body, signature] = raw.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const received = Buffer.from(signature, "base64url");
  const expectedBuffer = Buffer.from(expected, "base64url");
  if (received.length !== expectedBuffer.length || !timingSafeEqual(received, expectedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as AdminTokenPayload;
    if (!payload || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (typeof payload.email !== "string" || !payload.email) return null;
    if (payload.role !== "superadmin" && payload.role !== "internal") return null;
    return payload;
  } catch {
    return null;
  }
}

export function hasAdminToken(request: Request): boolean {
  return verifyAdminToken(request) !== null;
}

export function hasSuperadminToken(request: Request): boolean {
  return verifyAdminToken(request)?.role === "superadmin";
}

/** Reload internal accounts so revocation/deactivation applies to already-issued tokens. */
export async function resolveAdminSession(request: Request): Promise<AdminTokenPayload | null> {
  const session = verifyAdminToken(request);
  if (!session || session.role === "superadmin") return session;
  const account = await findInternalAccountById(session.sub);
  if (!account?.isActive) return null;
  return {
    ...session,
    name: account.name,
    email: account.email,
    pageAccess: account.pageAccess,
    permissions: account.permissions,
  };
}

/** Enforce module + action permissions against current server state. */
export async function requireAdmin(
  request: Request,
  page?: PageKey,
  action?: PermissionAction
): Promise<NextResponse | null> {
  let session: AdminTokenPayload | null;
  try {
    session = await resolveAdminSession(request);
  } catch {
    return NextResponse.json(
      { success: false, message: "Pemeriksaan izin tidak tersedia. Coba lagi." },
      { status: 503 }
    );
  }
  if (!session) return unauthorizedResponse();
  const operation =
    action ||
    (request.method === "GET" || request.method === "HEAD"
      ? "view"
      : request.method === "POST"
        ? "create"
        : request.method === "DELETE"
          ? "delete"
          : "edit");
  if (page && !canPerformAction(session, page, operation)) {
    return NextResponse.json(
      { success: false, message: "Anda tidak memiliki izin untuk tindakan pada modul ini." },
      { status: 403 }
    );
  }
  return null;
}

export function requireSuperadmin(request: Request): NextResponse | null {
  const session = verifyAdminToken(request);
  if (!session) return unauthorizedResponse();
  if (session.role !== "superadmin") return forbiddenResponse();
  return null;
}

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ success: false, message: "Sesi tidak valid. Silakan login ulang." }, { status: 401 });
}

export function forbiddenResponse(): NextResponse {
  return NextResponse.json(
    { success: false, message: "Akses ditolak. Hanya Superadmin yang boleh melakukan aksi ini." },
    { status: 403 }
  );
}

export function errorResponse(error: unknown, fallback: string): NextResponse {
  const message = error instanceof Error ? error.message : fallback;
  console.error(fallback, error);
  return NextResponse.json({ success: false, message }, { status: 500 });
}
