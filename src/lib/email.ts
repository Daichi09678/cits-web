import nodemailer from "nodemailer";
import { CONSULTATION_PURPOSES, CONSULTATION_SOURCES } from "@/lib/consultation";
import type { ConsultationDetails } from "@/types/schema";

interface SendContactNotificationParams {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceRequested?: string;
  productRequested?: string;
  consultation?: ConsultationDetails;
  message: string;
  recipientEmail?: string;
}

export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  resetUrl: string;
  expiresMinutes: number;
}): Promise<{ sent: boolean; reason?: string }> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log("ℹ️ SMTP belum dikonfigurasi; email reset kata sandi tidak dikirim.");
    return { sent: false, reason: "SMTP not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const safeName = escapeHtml(params.name || "Administrator");
    const safeUrl = escapeHtml(params.resetUrl);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #ea580c; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0 0 6px 0; font-size: 20px;">Reset Kata Sandi Back Office</h2>
          <p style="color: #64748b; margin: 0; font-size: 13px;">CITS Indonesia — Cipta Integrasi Teknologi Solusi</p>
        </div>

        <p style="color: #334155; font-size: 14px; line-height: 1.6;">Halo <strong>${safeName}</strong>,</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Kami menerima permintaan untuk mengatur ulang kata sandi akun back office Anda. Klik tombol di bawah ini untuk membuat kata sandi baru.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${safeUrl}" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 13px 24px; border-radius: 10px;">
            Buat Kata Sandi Baru
          </a>
        </div>

        <div style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 14px; margin-bottom: 20px;">
          <p style="margin: 0; color: #9a3412; font-size: 12px; line-height: 1.6;">
            Tautan ini hanya berlaku selama <strong>${params.expiresMinutes} menit</strong> dan hanya dapat digunakan satu kali.
          </p>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.6;">
          Jika Anda tidak meminta reset kata sandi, abaikan email ini. Kata sandi Anda tidak akan berubah.
        </p>

        <div style="font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;">
          Email ini dikirim otomatis oleh sistem keamanan CITS Back Office.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"CITS Back Office" <${user}>`,
      to: params.to,
      subject: "Reset Kata Sandi Akun Back Office CITS",
      html: htmlContent,
      text: `Halo ${params.name}, buka tautan berikut untuk membuat kata sandi baru: ${params.resetUrl}. Tautan berlaku ${params.expiresMinutes} menit dan hanya bisa dipakai sekali.`,
    });

    console.log(`✅ Email reset kata sandi dikirim ke ${params.to}`);
    return { sent: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengirim email.";
    console.error("❌ Gagal mengirim email reset kata sandi:", message);
    return { sent: false, reason: message };
  }
}

export async function sendContactNotificationEmail(
  params: SendContactNotificationParams
): Promise<{ sent: boolean; reason?: string }> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const toEmail = params.recipientEmail || process.env.NOTIFICATION_EMAIL || "info@citsindonesia.co.id";

  if (!host || !user || !pass) {
    console.log("ℹ️ SMTP belum dikonfigurasi (SMTP_HOST/USER/PASS). Pesan disimpan di database.");
    return { sent: false, reason: "SMTP not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #ea580c; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0 0 6px 0; font-size: 20px;">Pesan Baru dari Formulir Kontak CITS</h2>
          <p style="color: #64748b; margin: 0; font-size: 13px;">Diterima melalui Portal Resmi PT Cipta Integrasi Teknologi Solusi (CITS)</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px; font-weight: bold;">Nama Pengirim:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: bold;">${escapeHtml(params.name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Instansi / Perusahaan:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${escapeHtml(params.company)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Email Pengirim:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #ea580c; font-weight: bold;"><a href="mailto:${escapeHtml(params.email)}" style="color: #ea580c; text-decoration: none;">${escapeHtml(params.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Telepon / WhatsApp:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${escapeHtml(params.phone)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Layanan Diminta:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><span style="background-color: #fff7ed; color: #c2410c; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">${escapeHtml(params.serviceRequested || "Konsultasi Umum")}</span></td>
          </tr>
          ${params.productRequested ? `<tr><td style="padding: 10px; color: #64748b; font-weight: bold;">Produk Diminta:</td><td style="padding: 10px; color: #0f172a;">${escapeHtml(params.productRequested)}</td></tr>` : ""}
        </table>

        ${params.consultation ? `<div style="padding:16px; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:20px;"><h4 style="margin:0 0 10px;">Rincian Kebutuhan Pengunjung</h4><p>Tujuan: ${escapeHtml(CONSULTATION_PURPOSES[params.consultation.purpose || "discussion"])}</p>${params.consultation.source ? `<p>Asal konsultasi: ${escapeHtml(CONSULTATION_SOURCES[params.consultation.source])}</p>` : ""}${params.consultation.portfolio ? `<p>Referensi proyek: ${escapeHtml(params.consultation.portfolio.title)}</p><p>Lingkup referensi: ${escapeHtml(params.consultation.portfolio.scopeOfWork.join(", "))}</p>` : ""}<p>Fitur diminati: ${escapeHtml(params.consultation.requestedFeatures?.join(", ") || "Belum ditentukan")}</p><p>Hasil yang diharapkan: ${escapeHtml(params.consultation.expectedOutcome || "Belum disampaikan")}</p><p>Sistem saat ini: ${escapeHtml(params.consultation.currentSystem || "Belum disampaikan")}</p><p>Target waktu: ${escapeHtml(params.consultation.timeline || "Belum disampaikan")}</p><p>Perkiraan penggunaan: ${escapeHtml(params.consultation.usageEstimate || "Belum disampaikan")}</p></div>` : ""}

        <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <h4 style="margin: 0 0 10px 0; color: #334155; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Uraian Kebutuhan / Pesan:</h4>
          <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(params.message)}</p>
        </div>

        <div style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          Anda dapat langsung membalas email ini untuk merespons <strong>${escapeHtml(params.name)}</strong> secara langsung.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"CITS Website Notification" <${user}>`,
      to: toEmail,
      replyTo: params.email,
      subject: `[Konsultasi Proyek Baru] ${params.name} - ${params.company}`,
      html: htmlContent,
    });

    console.log(`✅ Notifikasi email berhasil dikirim ke ${toEmail}`);
    return { sent: true };
  } catch (error: any) {
    console.error("❌ Gagal mengirim notifikasi email:", error.message);
    return { sent: false, reason: error.message };
  }
}
