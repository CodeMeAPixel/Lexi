"use client";

import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

type Props = {
  open: boolean;
  tone: string;
  length: string;
  preserveEntities: boolean;
  preservePunctuation: boolean;
  extra?: string;
  onClose: () => void;
  onSave: (v: {
    tone: string;
    length: string;
    preserveEntities: boolean;
    preservePunctuation: boolean;
    extra?: string;
  }) => void;
};

function Listbox({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (open) {
      // when open, focus the active option after a tick
      const el = optionRefs.current[activeIndex];
      el?.focus();
    }
  }, [open, activeIndex]);

  useEffect(() => {
    function onDocKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onDocKey);
    return () => document.removeEventListener("keydown", onDocKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActiveIndex(0);
          }
        }}
        className="w-full text-left input"
      >
        {value}
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute z-40 w-full mt-2 overflow-hidden border rounded-md bg-grey-80 border-white/6 listbox-panel"
        >
          {options.map((opt, i) => (
            <li
              key={opt}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              role="option"
              tabIndex={-1}
              aria-selected={value === opt}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                onChange(opt);
                setOpen(false);
                triggerRef.current?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((s) => Math.min(s + 1, options.length - 1));
                  optionRefs.current[
                    Math.min(activeIndex + 1, options.length - 1)
                  ]?.focus();
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((s) => Math.max(s - 1, 0));
                  optionRefs.current[Math.max(activeIndex - 1, 0)]?.focus();
                } else if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(opt);
                  setOpen(false);
                  triggerRef.current?.focus();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setOpen(false);
                  triggerRef.current?.focus();
                }
              }}
              className={`px-3 py-2 cursor-pointer ${value === opt ? "bg-white/6 text-white" : "text-white/80 hover:bg-white/4"}`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RephraseSettings({
  open,
  tone,
  length,
  preserveEntities,
  preservePunctuation,
  extra,
  onClose,
  onSave,
}: Props) {
  const [localTone, setLocalTone] = useState(tone);
  const [localLength, setLocalLength] = useState(length);
  const [localPreserveEntities, setLocalPreserveEntities] =
    useState(preserveEntities);
  const [localPreservePunc, setLocalPreservePunc] =
    useState(preservePunctuation);
  const [localExtra, setLocalExtra] = useState(extra || "");

  useEffect(() => {
    if (open) {
      setLocalTone(tone);
      setLocalLength(length);
      setLocalPreserveEntities(preserveEntities);
      setLocalPreservePunc(preservePunctuation);
      setLocalExtra(extra || "");
    }
  }, [open, tone, length, preserveEntities, preservePunctuation, extra]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl">
      <div className="absolute inset-0 bg-grey-80/50" onClick={onClose} />

      <div className="relative w-full max-w-lg p-6 mx-4 rounded-lg bg-surface glass-panel">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Rephrase settings</h3>
          <button className="btn-ghost" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-xs text-white/70">Tone</label>
            <Listbox
              value={localTone}
              onChange={setLocalTone}
              options={["Casual", "Formal", "Informal", "Creative"]}
            />
          </div>

          <div>
            <label className="block mb-2 text-xs text-white/70">Length</label>
            <Listbox
              value={localLength}
              onChange={setLocalLength}
              options={["short", "medium", "long", "original"]}
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localPreserveEntities}
                onChange={(e) => setLocalPreserveEntities(e.target.checked)}
              />
              <span className="text-sm">Preserve named entities</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localPreservePunc}
                onChange={(e) => setLocalPreservePunc(e.target.checked)}
              />
              <span className="text-sm">Preserve punctuation</span>
            </label>
          </div>

          <div>
            <label className="block mb-2 text-xs text-white/70">
              Extra instructions (optional)
            </label>
            <input
              value={localExtra}
              onChange={(e) => setLocalExtra(e.target.value)}
              placeholder="e.g. make it more concise, use technical language"
              className="w-full input"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn"
              onClick={() => {
                onSave({
                  tone: localTone,
                  length: localLength,
                  preserveEntities: localPreserveEntities,
                  preservePunctuation: localPreservePunc,
                  extra: localExtra,
                });
                onClose();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
