/**
 * Kontrol buka/tutup sidebar back office di layar kecil (mobile/tablet).
 *
 * Dipakai lewat custom event agar AdminTopbar (hamburger) dan AdminSidebar
 * (panel) tidak perlu saling mengoper props di setiap halaman.
 */
const EVENT = "cits-admin-sidebar";

type SidebarDetail = { open?: boolean };

function dispatch(detail: SidebarDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<SidebarDetail>(EVENT, { detail }));
}

export function toggleAdminSidebar(): void {
  dispatch({ open: undefined as unknown as boolean });
}

export function openAdminSidebar(): void {
  dispatch({ open: true });
}

export function closeAdminSidebar(): void {
  dispatch({ open: false });
}

/** Berlangganan perubahan; `open` undefined berarti toggle. */
export function subscribeAdminSidebar(listener: (open: boolean | undefined) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event) => listener((event as CustomEvent<SidebarDetail>).detail?.open);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
