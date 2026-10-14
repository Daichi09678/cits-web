"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Sparkles, X, ArrowRight, Building2, Phone, Volume2 } from "lucide-react";
import { ContactMessage } from "@/database/schema";
import { playNewMessageSound } from "@/lib/audio";

export default function RealtimeNotificationToast() {
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleRealtimeMessage(event: Event) {
      const customEvent = event as CustomEvent<ContactMessage>;
      if (customEvent.detail) {
        setActiveMessage(customEvent.detail);
        setVisible(true);
        // Play gentle chime
        playNewMessageSound();
      }
    }

    window.addEventListener("cits-realtime-message", handleRealtimeMessage);
    return () => {
      window.removeEventListener("cits-realtime-message", handleRealtimeMessage);
    };
  }, []);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible || !activeMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="p-4 rounded-2xl bg-white/95 dark:bg-[#1A1A2E]/95 backdrop-blur-md border-2 border-orange-500 shadow-2xl shadow-orange-500/20 text-slate-900 dark:text-white space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <div className="flex items-center gap-1.5 text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" />
              <span>Pesan Konsultasi Baru!</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => playNewMessageSound()}
              title="Putar Ulang Nada Notifikasi"
              className="p-1 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setVisible(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sender details */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm truncate">
              {activeMessage.name}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-500/15 text-orange-800 dark:text-orange-300 truncate max-w-[130px]">
              {activeMessage.company}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{activeMessage.email}</span>
            <span>•</span>
            <span>{activeMessage.phone}</span>
          </div>
        </div>

        {/* Need & Message Snippet */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-xs">
          <span className="block text-[10px] font-bold text-orange-600 dark:text-orange-400 mb-0.5">
            Kebutuhan: {activeMessage.serviceRequested || "Konsultasi TI"}
          </span>
          <p className="text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed italic">
            &ldquo;{activeMessage.message}&rdquo;
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-400">Baru saja masuk</span>
          <Link
            href="/admin/contact"
            onClick={() => setVisible(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm shadow-orange-600/20 transition-all"
          >
            <span>Buka di Mail Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
