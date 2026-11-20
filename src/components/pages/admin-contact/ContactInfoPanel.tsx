"use client";
import { BackOfficeInput as Input, BackOfficeTextarea as Textarea } from "@/components/ui/Input";
import { BackOfficeButton as Button } from "@/components/ui/Button";
import FormFeedback from "@/components/ui/FormFeedback";
import FieldLabel from "@/components/ui/FieldLabel";

import { Mail, Phone, MapPin, Clock, Save, CheckCircle2 } from "lucide-react";
import type { ContactEditorState } from "./useContactEditor";

export default function ContactInfoPanel({ editor }: { editor: ContactEditorState }) {
  const {
    activeTab,
    savedSuccess,
    settingsSaving,
    canEdit,
    handleSaveInfo,
    address,
    setAddress,
    phone,
    setPhone,
    email,
    setEmail,
    workingHours,
    setWorkingHours,
    emergencyPhone,
    setEmergencyPhone,
  } = editor;
  return (
    <>
      {activeTab === "info" && (
        <div className="mt-6 max-w-3xl rounded-xl bg-white dark:bg-[#151528] border border-gray-200 dark:border-white/10 p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pengaturan Informasi Kontak</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Data kontak ini otomatis disinkronkan ke footer dan halaman kontak publik.
            </p>
          </div>

          {savedSuccess && (
            <FormFeedback tone="success" className="mb-6 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">Informasi kontak berhasil disimpan.</span>
            </FormFeedback>
          )}

          <form onSubmit={handleSaveInfo} className="space-y-4">
            <fieldset disabled={!canEdit || settingsSaving} aria-label="Informasi kontak" className="space-y-4">
              <div>
                <FieldLabel htmlFor="contact-info-panel-address" fieldSize="sm">
                  Alamat Kantor Pusat
                </FieldLabel>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <Textarea
                    rows={3}
                    withIcon
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    fieldSize="sm"
                    className="w-full"
                    id="contact-info-panel-address"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="contact-info-panel-phone" fieldSize="sm">
                    Nomor Telepon Kantor
                  </FieldLabel>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      fieldSize="sm"
                      className="w-full"
                      withIcon
                      id="contact-info-panel-phone"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="contact-info-panel-email" fieldSize="sm">
                    Email Resmi
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fieldSize="sm"
                      className="w-full"
                      withIcon
                      id="contact-info-panel-email"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <FieldLabel htmlFor="contact-info-panel-working-hours" fieldSize="sm">
                    Jam Operasional Layanan
                  </FieldLabel>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      value={workingHours}
                      onChange={(e) => setWorkingHours(e.target.value)}
                      fieldSize="sm"
                      className="w-full"
                      withIcon
                      id="contact-info-panel-working-hours"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="contact-info-panel-emergency-phone" fieldSize="sm">
                    Nomor Darurat WhatsApp
                  </FieldLabel>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      fieldSize="sm"
                      className="w-full"
                      withIcon
                      id="contact-info-panel-emergency-phone"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                <Button type="submit" variant="primary" size="md" busy={settingsSaving} busyLabel="Menyimpan...">
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </Button>
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </>
  );
}
