"use client";

import { useState } from "react";
import { Building2, Save, CheckCircle2, Sparkles, Plus, Trash2 } from "lucide-react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useCitsStore } from "@/database/store";

export default function AdminAboutPage() {
  const { aboutData, actions } = useCitsStore();

  const [title, setTitle] = useState(aboutData.title);
  const [subtitle, setSubtitle] = useState(aboutData.subtitle);
  const [story, setStory] = useState(aboutData.story);
  const [vision, setVision] = useState(aboutData.vision);
  const [mission, setMission] = useState<string[]>(aboutData.mission);
  const [stats, setStats] = useState(aboutData.stats);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleMissionChange = (index: number, val: string) => {
    const updated = [...mission];
    updated[index] = val;
    setMission(updated);
  };

  const addMissionItem = () => {
    setMission([...mission, "Poin misi baru"]);
  };

  const removeMissionItem = (index: number) => {
    setMission(mission.filter((_, i) => i !== index));
  };

  const handleStatChange = (index: number, field: "label" | "value" | "description", val: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: val };
    setStats(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    actions.saveAboutData({
      ...aboutData,
      title,
      subtitle,
      story,
      vision,
      mission,
      stats,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminTopbar
        title="Manajemen Tentang Kami"
        description="Kelola narasi profil perusahaan, visi, misi, dan angka statistik pencapaian CITS Indonesia"
      />
      <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Data Tentang Kami berhasil disimpan dan langsung disinkronkan ke Front Office!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Profil & Narasi */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">
            Narasi Profil Perusahaan
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Judul Utama
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Tagline / Subjudul
              </label>
              <input
                type="text"
                required
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Cerita & Sejarah CITS
            </label>
            <textarea
              rows={4}
              required
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Section 2: Visi & Misi */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">
            Visi & Misi Perusahaan
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Visi CITS
            </label>
            <input
              type="text"
              required
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Daftar Misi Strategis
              </label>
              <button
                type="button"
                onClick={addMissionItem}
                className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Misi</span>
              </button>
            </div>

            <div className="space-y-2">
              {mission.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-bold text-slate-400">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleMissionChange(idx, e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {mission.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMissionItem(idx)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Statistik Pencapaian */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">
            Angka Statistik Pencapaian
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5"
              >
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Nilai
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-black text-orange-600"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Label
                    </label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={stat.description}
                    onChange={(e) => handleStatChange(idx, "description", e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#151528] border border-slate-200/90 dark:border-white/10 shadow-xs flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Pastikan data sudah benar sebelum menyimpan ke sistem live
          </span>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
