"use client";

import { format } from "date-fns";
import { motion } from "framer-motion";
import clsx from "clsx";
import { MonthTheme } from "@/theme";

function formatRangeLabel(startDate: Date | null, endDate: Date | null) {
  if (!startDate) return "Select a date range";
  if (!endDate) return format(startDate, "MMM d, yyyy");
  return `${format(startDate, "MMM d")} – ${format(endDate, "MMM d, yyyy")}`;
}

export default function NotesPanel({
  rangeKey,
  startDate,
  endDate,
  value,
  onChange,
  onClear,
  theme,
}: {
  rangeKey: string;
  startDate: Date | null;
  endDate: Date | null;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  theme: MonthTheme;
}) {
  const disabled = !rangeKey || !startDate || !endDate;

  return (
    <motion.section
      className={clsx(
        "rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-5 flex flex-col h-full",
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-white">Notes</h2>
          <p className="mt-0.5 text-sm text-zinc-300/80">
            {formatRangeLabel(startDate, endDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={clsx(
              "h-9 rounded-full border border-white/10 px-4 text-sm font-medium text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
              disabled || !value.trim() ? "bg-white/10 opacity-50" : `${theme.buttonBg} ${theme.buttonHover}`
            )}
            onClick={onClear}
            disabled={disabled || !value.trim()}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4 flex-1 flex flex-col">
        <textarea
          className={clsx(
            "h-full min-h-[140px] flex-1 w-full resize-none rounded-2xl border bg-white/5 px-4 py-3 text-sm leading-6 text-white shadow-inner placeholder:text-zinc-400/80 focus:outline-none transition",
            disabled
              ? "border-white/10"
              : `border-white/10 focus:${theme.border} focus:ring-4 ${theme.ring}`,
          )}
          placeholder={disabled ? "Select a full range (start + end) to attach notes." : "Write a note for this selected range…"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      {rangeKey ? (
        <p className="mt-3 text-xs text-zinc-300/70">Saved as: {rangeKey}</p>
      ) : null}
    </motion.section>
  );
}
