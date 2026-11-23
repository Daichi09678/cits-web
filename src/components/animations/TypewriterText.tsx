"use client";

import { useState, useEffect } from "react";
import GradientText from "@/components/ui/GradientText";
import accentStyles from "@/components/pages/public/PublicAccent.module.css";

interface TypewriterTextProps {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export default function TypewriterText({
  words = ["Sepenuh Hati", "Tingkat Enterprise", "Skala Nasional", "Berbasis Inovasi", "Terpercaya Sejak 2006"],
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseDuration = 2200,
  className = "",
  cursorClassName = "",
}: TypewriterTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const targetWord = words[currentWordIndex % words.length];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting) {
      // Typing phase
      if (currentText.length < targetWord.length) {
        const timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished typing word, pause before deleting
        setIsPaused(true);
      }
    } else {
      // Deleting phase
      if (currentText.length > 0) {
        const timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length - 1));
        }, deletingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished deleting, move to next word
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }
  }, [currentText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline min-h-[1.15em] [overflow-wrap:anywhere]">
      <GradientText className={className}>{currentText || "\u00A0"}</GradientText>
      <span
        className={`ml-1 inline-block h-[0.85em] w-[3px] animate-pulse rounded-full align-baseline sm:w-[4px] ${accentStyles.fill} ${cursorClassName}`}
        aria-hidden="true"
      />
    </span>
  );
}
