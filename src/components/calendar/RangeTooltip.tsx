"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { differenceInDays, format } from "date-fns";
import { MonthTheme } from "@/theme";

export default function RangeTooltip({
  startDate,
  endDate,
  hoverDate,
  theme,
}: {
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  theme: MonthTheme;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (!endDate && hoverDate) {
      window.addEventListener("mousemove", handleMove);
    }

    return () => window.removeEventListener("mousemove", handleMove);
  }, [endDate, hoverDate]);

  const activeEnd = endDate || hoverDate;
  const show = startDate && !endDate && activeEnd && startDate.getTime() !== activeEnd.getTime();

  if (!show) return null;

  const start = startDate.getTime() < activeEnd.getTime() ? startDate : activeEnd;
  const end = startDate.getTime() < activeEnd.getTime() ? activeEnd : startDate;
  const daysDiff = Math.abs(differenceInDays(end, start)) + 1;

  const label = `${format(start, "MMM d")} → ${format(end, "MMM d")} (${daysDiff} day${daysDiff > 1 ? "s" : ""})`;

  return (
    <AnimatePresence>
      <motion.div
        className={`pointer-events-none fixed z-[60] flex items-center justify-center whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-xs font-medium text-white shadow-xl ring-1 ${theme.border} backdrop-blur-md`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, x: mousePos.x + 16, y: mousePos.y + 16 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {label}
      </motion.div>
    </AnimatePresence>
  );
}
