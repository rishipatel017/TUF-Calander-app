"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay, isSameMonth, startOfToday } from "date-fns";
import { clsx } from "clsx";
import { MonthTheme } from "@/theme";
import { generateCalendarDays } from "@/components/calendar/generateCalendarDays";
import RangeTooltip from "@/components/calendar/RangeTooltip";

function isInRange(day: Date, startDate: Date | null, endDate: Date | null) {
  if (!startDate || !endDate) return false;
  const t = day.getTime();
  const a = startDate.getTime();
  const b = endDate.getTime();
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return t > min && t < max;
}

function isInPreviewRange(day: Date, startDate: Date | null, previewEnd: Date | null) {
  if (!startDate || !previewEnd) return false;
  const t = day.getTime();
  const a = startDate.getTime();
  const b = previewEnd.getTime();
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return t > min && t < max;
}

export default function Calendar({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  startDate,
  endDate,
  hoverDate,
  onDayClick,
  onDayHover,
  holidays,
  noteDates,
  theme,
}: {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  onDayClick: (day: Date) => void;
  onDayHover: (day: Date) => void;
  holidays: string[];
  noteDates: string[];
  theme: MonthTheme;
}) {
  const today = startOfToday();
  const days = generateCalendarDays(currentMonth);

  const previewEnd = endDate ? null : hoverDate;

  const [prevMonth, setPrevMonth] = useState(currentMonth);
  const [direction, setDirection] = useState(0);

  if (currentMonth.getTime() !== prevMonth.getTime()) {
    setDirection(currentMonth > prevMonth ? 1 : -1);
    setPrevMonth(currentMonth);
  }

  const variants = {
    enter: (dir: number) => ({ 
      rotateX: dir > 0 ? -80 : 80, 
      y: dir > 0 ? 40 : -40, 
      opacity: 0,
      scale: 0.9,
    }),
    center: { 
      rotateX: 0, 
      y: 0, 
      opacity: 1,
      scale: 1, 
    },
    exit: (dir: number) => ({ 
      rotateX: dir > 0 ? 80 : -80, 
      y: dir > 0 ? -40 : 40, 
      opacity: 0,
      scale: 0.9, 
    }),
  };

  return (
    <div className="relative">
      <RangeTooltip
        startDate={startDate}
        endDate={endDate}
        hoverDate={hoverDate}
        theme={theme}
      />
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onPrevMonth}
          className="h-9 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-white/15 active:scale-[0.98]"
        >
          Prev
        </button>

        <div className="text-center">
          <div className="text-lg font-semibold text-white">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <div className="mt-0.5 text-xs text-zinc-300/80">Select a start date, then an end date</div>
        </div>

        <button
          type="button"
          onClick={onNextMonth}
          className="h-9 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-white/15 active:scale-[0.98]"
        >
          Next
        </button>
      </div>

      <div className="relative mt-4" style={{ perspective: "1200px" }}>
        <motion.div
          className="grid grid-cols-7 gap-2 mb-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const).map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-zinc-300/80">
              {d}
            </div>
          ))}
        </motion.div>

        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentMonth.toISOString()}
            className="grid grid-cols-7 gap-2 w-full"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          >
            {days.map((day) => {
              const muted = !isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, today);
              const isSunday = day.getDay() === 0;
              const dateString = format(day, "yyyy-MM-dd");
              const isHoliday = holidays.includes(dateString) || isSunday;
              
              const isStart = startDate ? isSameDay(day, startDate) : false;
              const isEnd = endDate ? isSameDay(day, endDate) : false;
              const inRange = isInRange(day, startDate, endDate);

              const inPreview = !endDate && isInPreviewRange(day, startDate, previewEnd);

              const rounded = isStart && isEnd ? "rounded-full" : isStart ? "rounded-l-full" : isEnd ? "rounded-r-full" : "rounded-full";

              const base = "relative flex h-10 w-10 items-center justify-center text-sm font-medium transition select-none will-change-transform active:scale-[0.95]";

              return (
                <motion.button
                  key={day.toISOString()}
                  type="button"
                  onClick={(e) => {
                    if (muted) return;
                    onDayClick(day);
                  }}
                  onPointerEnter={() => {
                    if (muted) return;
                    onDayHover(day);
                  }}
                  whileHover={
                    muted
                      ? undefined
                      : {
                          scale: 1.08,
                          boxShadow: `0px 12px 30px ${theme.glowShadow}`,
                        }
                  }
                  whileTap={muted ? undefined : { scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={clsx(
                    base,
                    rounded,
                    muted
                      ? "text-zinc-500/70"
                      : isHoliday && !isStart && !isEnd
                      ? `${theme.primaryText} hover:bg-white/10`
                      : "text-zinc-100 hover:bg-white/10",
                    isToday && `ring-2 ${theme.ring} ring-offset-0`,
                    inRange && theme.rangeBg,
                    inPreview && theme.previewBg,
                    (isStart || isEnd) && `bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white shadow-sm`,
                  )}
                  aria-pressed={isStart || isEnd}
                >
                  <span className="relative z-10 flex flex-col items-center">
                    {format(day, "d")}
                    
                    {/* Interaction and Status Indicators */}
                    <div className="absolute -bottom-1.5 flex gap-1">
                      {noteDates.includes(dateString) && (
                        <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                      )}
                      {isHoliday && (
                        <span className="h-1 w-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                      )}
                    </div>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend Footer */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-300/80">
        <div className="flex items-center gap-2">
          <span className={clsx("h-3 w-3 rounded-full", theme.primaryBg)} />
          <span>Start / End</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx("h-3 w-3 rounded-full ring-1 ring-white/10", theme.previewBg)} />
          <span>In range</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span>Has Note</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          <span>Holiday</span>
        </div>
      </div>
    </div>
  );
}
