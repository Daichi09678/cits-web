import nodemailer from "nodemailer";

interface SendContactNotificationParams {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceRequested?: string;
  message: string;
  recipientEmail?: string;
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
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: bold;">${params.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Instansi / Perusahaan:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${params.company}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Email Pengirim:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #ea580c; font-weight: bold;"><a href="mailto:${params.email}" style="color: #ea580c; text-decoration: none;">${params.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Telepon / WhatsApp:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${params.phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-weight: bold;">Layanan Diminta:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a;"><span style="background-color: #fff7ed; color: #c2410c; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">${params.serviceRequested || "Konsultasi Umum"}</span></td>
          </tr>
        </table>

        <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <h4 style="margin: 0 0 10px 0; color: #334155; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Uraian Kebutuhan / Pesan:</h4>
          <p style="margin: 0; color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${params.message}</p>
        </div>

        <div style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          Anda dapat langsung membalas email ini untuk merespons <strong>${params.name}</strong> secara langsung.
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
