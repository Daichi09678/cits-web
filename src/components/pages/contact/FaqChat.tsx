"use client";
import Button from "@/components/ui/Button";

import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import styles from "./FaqChat.module.css";

export interface FaqChatItem {
  question: string;
  answer: string;
}

interface ChatMessage {
  id: number;
  role: "bot" | "user";
  text: string;
}

const GREETING = "Pilih salah satu pertanyaan di bawah untuk melihat jawabannya.";

export default function FaqChat({ faqs }: { faqs: readonly FaqChatItem[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 0, role: "bot", text: GREETING }]);
  const logRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  const ask = (faq: FaqChatItem) => {
    const questionMessage: ChatMessage = { id: nextId.current++, role: "user", text: faq.question };
    const answerMessage: ChatMessage = {
      id: nextId.current++,
      role: "bot",
      text: faq.answer,
    };
    setMessages((current) => [...current, questionMessage, answerMessage]);
  };

  return (
    <SpotlightCard className="h-full" disableSpotlight>
      <div className={`${styles.faq} flex h-full flex-col p-5 sm:p-7 md:p-8`}>
        <div className="border-b border-gray-200 pb-5 dark:border-white/10">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-extrabold text-dark md:text-2xl dark:text-white">Tanya Jawab CITS</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-white/85">
              Informasi seputar layanan dan proses kerja sama, berdasarkan daftar tanya jawab CITS.
            </p>
          </div>
        </div>

        {/* Ruang percakapan */}
        <div className="mt-5 rounded-2xl border border-gray-200 bg-slate-50/80 p-3 sm:p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Pertanyaan dan jawaban CITS"
            className="max-h-[300px] min-h-[200px] space-y-4 overflow-y-auto pr-1 sm:min-h-[220px]"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`min-w-0 max-w-[95%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-orange-50 text-orange-950 dark:bg-orange-950/30 dark:text-orange-100"
                      : "border border-gray-200 bg-white text-gray-800 dark:border-white/10 dark:bg-[#1A1A2E] dark:text-white/90"
                  }`}
                >
                  <p className="mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {message.role === "user" ? "Pertanyaan Anda" : "Informasi CITS"}
                  </p>
                  <p className="break-words whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pertanyaan yang tersedia */}
        <div className="mt-5">
          <p className="text-sm font-bold text-gray-800 dark:text-white/90">Pertanyaan yang tersedia</p>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {faqs.map((faq) => (
              <Button
                variant="unstyled"
                size="none"
                key={faq.question}
                type="button"
                onClick={() => ask(faq)}
                className="group flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left transition-colors hover:border-orange-400 hover:bg-orange-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-white/10 dark:bg-white/5 dark:hover:border-orange-500/50 dark:hover:bg-orange-500/10"
              >
                <span className="text-sm leading-snug font-semibold text-gray-800 dark:text-white/90">
                  {faq.question}
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
