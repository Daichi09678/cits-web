import type { ContactInfo } from "@/types/schema";

export function contactPresentation(contact: ContactInfo) {
  const digits = (contact.emergencyPhone || "").replace(/\D/g, "");
  const whatsappNumber = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  const query = encodeURIComponent(contact.address);
  return {
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
    mapEmbedUrl: `https://maps.google.com/maps?q=${query}&output=embed`,
    whatsappUrl: whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=Halo%20Tim%20CITS,%20saya%20ingin%20berkonsultasi%20mengenai%20kebutuhan%20solusi%20TI.`
      : "",
  };
}
