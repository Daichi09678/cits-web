"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  company: string;
}

export default function TestimonialSlider({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const activeTestimonial = testimonials[Math.min(current, Math.max(0, testimonials.length - 1))];

  useEffect(() => {
    if (!testimonials.length) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  if (!activeTestimonial) return null;

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#1A1A2E] border border-gray-200 dark:border-white/10 p-8 md:p-12 min-h-[220px] flex items-center shadow-sm">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -80 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full text-center"
          >
            <Quote className="w-10 h-10 text-orange-500/30 dark:text-orange-400/30 mx-auto mb-4" />
            <p className="text-gray-800 dark:text-white/90 text-lg italic leading-relaxed">
              &ldquo;{activeTestimonial.quote}&rdquo;
            </p>
            <div className="mt-6">
              <p className="font-semibold text-dark dark:text-white">{activeTestimonial.name}</p>
              <p className="text-sm text-gray-700 dark:text-white/80">{activeTestimonial.company}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/20 bg-white dark:bg-[#1A1A2E] text-gray-700 dark:text-white/90 flex items-center justify-center hover:border-orange-600 hover:text-orange-700 dark:hover:text-orange-400 transition-colors cursor-pointer"
          aria-label="Testimonial sebelumnya"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                i === current
                  ? "bg-orange-600 w-6"
                  : "bg-gray-300 dark:bg-white/30 hover:bg-gray-400 dark:hover:bg-white/50 w-2.5"
              }`}
              aria-label={`Lihat testimoni ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/20 bg-white dark:bg-[#1A1A2E] text-gray-700 dark:text-white/90 flex items-center justify-center hover:border-orange-600 hover:text-orange-700 dark:hover:text-orange-400 transition-colors cursor-pointer"
          aria-label="Testimonial berikutnya"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
