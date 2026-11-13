"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bot, ChevronRight, MessageSquare, Send, User } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Input from "@/components/ui/Input";

export interface FaqChatItem {
  question: string;
  answer: string;
}

interface ChatMessage {
  id: number;
  role: "bot" | "user";
  text: string;
}

const GREETING =
  "Halo! Saya asisten CITS. Silakan pilih salah satu pertanyaan di bawah, atau tulis pertanyaan Anda sendiri.";

const FALLBACK =
  "Maaf, saya belum punya jawaban untuk pertanyaan itu. Silakan pilih pertanyaan yang tersedia, atau kirim detail kebutuhan Anda lewat formulir konsultasi di atas agar tim CITS menjawab langsung.";

/** Skor kecocokan sederhana: jumlah kata kunci pertanyaan yang muncul di input. */
function scoreMatch(query: string, faq: FaqChatItem): number {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3);

  const queryWords = new Set(normalize(query));
  if (queryWords.size === 0) return 0;

  let score = 0;
  for (const word of normalize(faq.question)) {
    if (queryWords.has(word)) score += 1;
  }
  return score;
}

function findAnswer(query: string, faqs: readonly FaqChatItem[]): string | null {
  let best: { score: number; answer: string } | null = null;
  for (const faq of faqs) {
    const score = scoreMatch(query, faq);
    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: faq.answer };
    }
  }
  return best ? best.answer : null;
}

export default function FaqChat({ faqs }: { faqs: readonly FaqChatItem[] }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 0, role: "bot", text: GREETING }]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const logRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const node = logRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, thinking]);

  const reply = (text: string, delay = 420) => {
    setThinking(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: nextId.current++, role: "bot", text }]);
      setThinking(false);
    }, delay);
  };

  const ask = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || thinking) return;
    setMessages((current) => [...current, { id: nextId.current++, role: "user", text: trimmed }]);
    reply(findAnswer(trimmed, faqs) ?? FALLBACK);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    ask(draft);
    setDraft("");
  };

  return (
    <SpotlightCard className="h-full">
      <div className="flex h-full flex-col p-7 md:p-10">
        {/* Header */}
        <div className="flex items-start gap-3.5 border-b border-gray-150 pb-6 dark:border-white/10">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-200/80 bg-orange-100 text-orange-700 dark:border-orange-800/60 dark:bg-orange-950/60 dark:text-orange-400">
            <MessageSquare aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-extrabold text-dark md:text-2xl dark:text-white">Tanya Asisten CITS</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-white/85">
              Pilih pertanyaan yang tersedia atau tulis sendiri — jawaban diambil dari daftar resmi CITS.
            </p>
          </div>
          <span className="mt-1 hidden shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 sm:inline-flex dark:bg-emerald-500/10 dark:text-emerald-300">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Aktif
          </span>
        </div>

        {/* Ruang percakapan */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-label="Percakapan dengan asisten CITS"
            className="max-h-[300px] min-h-[220px] space-y-4 overflow-y-auto pr-1"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    message.role === "bot"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400"
                      : "bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-white/70"
                  }`}
                >
                  {message.role === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </span>
                <p
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-tr-md bg-orange-600 text-white"
                      : "rounded-tl-md border border-gray-200 bg-white text-gray-800 dark:border-white/10 dark:bg-[#1A1A2E] dark:text-white/90"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}

            {thinking && (
              <div className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400"
                >
                  <Bot className="h-4 w-4" />
                </span>
                <span className="rounded-2xl rounded-tl-md border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-500 dark:border-white/10 dark:bg-[#1A1A2E] dark:text-white/60">
                  Asisten sedang menulis…
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pertanyaan yang tersedia */}
        <div className="mt-6">
          <p className="text-sm font-bold text-gray-800 dark:text-white/90">Pertanyaan yang tersedia</p>
          <div className="mt-2.5 space-y-2">
            {faqs.map((faq) => (
              <button
                key={faq.question}
                type="button"
                onClick={() => ask(faq.question)}
                className="group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-left transition-colors hover:border-orange-400 hover:bg-orange-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:border-white/10 dark:bg-white/5 dark:hover:border-orange-500/50 dark:hover:bg-orange-500/10"
              >
                <span className="text-sm leading-snug font-semibold text-gray-800 dark:text-white/90">
                  {faq.question}
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-orange-600 dark:group-hover:text-orange-400"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Input chat — tinggi & radius sama dengan kontrol form di atasnya */}
        <form onSubmit={onSubmit} className="mt-6 flex items-center gap-2">
          <label htmlFor="faq-chat-input" className="sr-only">
            Tulis pertanyaan Anda
          </label>
          <Input
            fieldSize="md"
            id="faq-chat-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Tulis pertanyaan Anda…"
            autoComplete="off"
          />
          <button
            type="submit"
            aria-label="Kirim pertanyaan"
            className="inline-flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center rounded-xl bg-orange-600 text-white transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={thinking || draft.trim().length === 0}
          >
            <Send aria-hidden="true" className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-600 dark:text-white/60">
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          Butuh jawaban lebih detail? Kirim formulir konsultasi di atas.
        </p>
      </div>
    </SpotlightCard>
  );
}
