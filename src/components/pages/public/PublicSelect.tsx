"use client";
import Button from "@/components/ui/Button";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import styles from "./PublicSelect.module.css";
import accentStyles from "./PublicAccent.module.css";

type Option = string | { value: string; label: string };

export interface PublicSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  labelledBy?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export default function PublicSelect({
  options,
  placeholder,
  value = "",
  onChange,
  labelledBy,
  id: suppliedId,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
}: PublicSelectProps) {
  const generatedId = useId();
  const id = suppliedId ?? generatedId;
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [position, setPosition] = useState<CSSProperties>({});
  const items = [
    ...(placeholder === undefined ? [] : [{ value: "", label: placeholder }]),
    ...options.map((item) => (typeof item === "string" ? { value: item, label: item } : item)),
  ];
  const selected = items.findIndex((item) => item.value === value);
  const expanded = open && !disabled && items.length > 0;

  useEffect(() => {
    if (!expanded) return;
    function place() {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      const below = window.innerHeight - rect.bottom - 16;
      const above = rect.top - 16;
      const up = below < 220 && above > below;
      const width = Math.min(rect.width, window.innerWidth - 24);
      setPosition({
        position: "fixed",
        width,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)),
        maxHeight: Math.min(300, Math.max(44, up ? above : below)),
        ...(up ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
      });
    }
    function dismiss(event: PointerEvent) {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !panel.current?.contains(target)) setOpen(false);
    }
    function onScroll(event: Event) {
      if (!panel.current?.contains(event.target as Node)) place();
    }
    place();
    document.addEventListener("pointerdown", dismiss);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const option = panel.current?.children[active] as HTMLElement | undefined;
    if (option && panel.current) {
      const top = option.offsetTop;
      const bottom = top + option.offsetHeight;
      if (top < panel.current.scrollTop) panel.current.scrollTop = top;
      else if (bottom > panel.current.scrollTop + panel.current.clientHeight)
        panel.current.scrollTop = bottom - panel.current.clientHeight;
    }
  }, [expanded, active]);

  function choose(index: number) {
    if (!items[index]) return;
    onChange?.(items[index].value);
    setOpen(false);
    trigger.current?.focus();
  }

  return (
    <div className={`${styles.root} ${className}`}>
      <Button variant="unstyled" size="none"
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        disabled={disabled || !items.length}
        aria-expanded={expanded}
        aria-controls={expanded ? `${id}-list` : undefined}
        aria-haspopup="listbox"
        aria-labelledby={labelledBy}
        aria-label={ariaLabel ?? (labelledBy || suppliedId ? undefined : (placeholder ?? "Pilih opsi"))}
        aria-activedescendant={expanded ? `${id}-option-${active}` : undefined}
        onBlur={() => setOpen(false)}
        onClick={() => {
          setActive(Math.max(selected, 0));
          setOpen(!expanded);
          search.current.text = "";
        }}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            setOpen(true);
            setActive(
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? items.length - 1
                  : !expanded
                    ? Math.max(selected, 0)
                    : Math.max(0, Math.min(items.length - 1, active + (event.key === "ArrowDown" ? 1 : -1)))
            );
          } else if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          } else if (expanded && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            choose(active);
          } else if (event.key.length === 1 && event.key.trim() && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            const now = Date.now();
            search.current.text =
              now - search.current.time < 700
                ? search.current.text + event.key.toLocaleLowerCase()
                : event.key.toLocaleLowerCase();
            search.current.time = now;
            const query = new Set(search.current.text).size === 1 ? event.key.toLocaleLowerCase() : search.current.text;
            const start = query.length === 1 ? active + 1 : active;
            for (let offset = 0; offset < items.length; offset++) {
              const index = (start + offset) % items.length;
              if (items[index].label.toLocaleLowerCase().startsWith(query)) {
                setActive(index);
                setOpen(true);
                break;
              }
            }
          }
        }}
        className={styles.trigger}
        data-open={expanded}
        data-placeholder={!value && placeholder !== undefined}
      >
        <span className={styles.value}>{items[selected]?.label ?? placeholder ?? "Tidak ada pilihan"}</span>
        <span className={styles.chevron}>
          <ChevronDown aria-hidden="true" size={16} />
        </span>
      </Button>
      {expanded &&
        createPortal(
          <div
            ref={panel}
            id={`${id}-list`}
            role="listbox"
            aria-labelledby={labelledBy}
            aria-label={ariaLabel ?? (labelledBy ? undefined : (placeholder ?? "Pilihan"))}
            className={`${styles.panel} ${accentStyles.surface}`}
            style={position}
            onPointerDown={(event) => event.preventDefault()}
          >
            {items.map((item, index) => (
              <div
                key={item.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={item.value === value}
                onPointerMove={(event) => {
                  if (event.pointerType === "mouse") setActive(index);
                }}
                onClick={() => choose(index)}
                className={styles.option}
                data-active={index === active}
              >
                <span>{item.label}</span>
                <span className={styles.check}>{item.value === value && <Check aria-hidden="true" size={16} />}</span>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
