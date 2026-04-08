"use client";

import { useEffect, useMemo, useState } from "react";
import { addMonths, format, isAfter, isBefore, isSameDay, startOfMonth, subMonths, addDays } from "date-fns";
import { MONTH_THEMES } from "@/theme";
import { motion } from "framer-motion";
import HeroImage from "@/components/HeroImage";
import NotesPanel from "@/components/NotesPanel";
import Calendar from "@/components/calendar/Calendar";
import CursorGlow from "@/components/CursorGlow";

type NotesMap = Record<string, string>;

function makeRangeKey(start: Date | null, end: Date | null) {
  if (!start || !end) return "";
  const startKey = format(start, "yyyy-MM-dd");
  const endKey = format(end, "yyyy-MM-dd");
  return `${startKey}_to_${endKey}`;
}

function normalizeRange(start: Date | null, end: Date | null) {
  if (!start || !end) return { start, end };
  if (isAfter(start, end)) return { start: end, end: start };
  return { start, end };
}

export default function CalendarLayout() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<NotesMap>({});
  const [holidays, setHolidays] = useState<string[]>([]);

  const currentYear = currentMonth.getFullYear();

  useEffect(() => {
    async function getHolidays() {
      try {
        const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/IN`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setHolidays(data.map((d: any) => d.date));
        }
      } catch {}
    }
    getHolidays();
  }, [currentYear]);

  const noteDates = useMemo(() => {
    const arr: string[] = [];
    for (const key of Object.keys(notes)) {
      if (!notes[key] || notes[key].trim() === "") continue;
      const [s, e] = key.split("_to_");
      if (s && e) {
        let curr = new Date(s);
        const endDay = new Date(e);
        let count = 0;
        while (curr <= endDay && count < 366) {
          arr.push(format(curr, "yyyy-MM-dd"));
          curr = addDays(curr, 1);
          count++;
        }
      }
    }
    return arr;
  }, [notes]);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage on mount
    try {
      const rawNotes = localStorage.getItem("calendar_notes_v1");
      if (rawNotes) setNotes(JSON.parse(rawNotes));
    } catch {}

    try {
      const rawDates = localStorage.getItem("calendar_dates_v1");
      if (rawDates) {
        const { s, e, m } = JSON.parse(rawDates);
        if (s) setStartDate(new Date(s));
        if (e) setEndDate(new Date(e));
        if (m) setCurrentMonth(new Date(m));
      }
    } catch {}
  }, []);

  const { start, end } = useMemo(
    () => normalizeRange(startDate, endDate),
    [startDate, endDate],
  );

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("calendar_notes_v1", JSON.stringify(notes));
    } catch {}
  }, [notes, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        "calendar_dates_v1",
        JSON.stringify({
          s: startDate ? startDate.toISOString() : null,
          e: endDate ? endDate.toISOString() : null,
          m: currentMonth.toISOString(),
        })
      );
    } catch {}
  }, [startDate, endDate, currentMonth, mounted]);

  const rangeKey = useMemo(() => makeRangeKey(start, end), [start, end]);
  const activeNote = rangeKey ? notes[rangeKey] ?? "" : "";

  const monthLabel = useMemo(() => format(currentMonth, "MMMM yyyy"), [currentMonth]);
  const currentMonthIndex = currentMonth.getMonth();
  const theme = MONTH_THEMES[currentMonthIndex];

  return (
    <div className={`relative flex-1 overflow-hidden ${theme.appBg} ${theme.fontClass} text-zinc-50 transition-colors duration-700 ease-in-out`}>
      <CursorGlow color={theme.cursorColor} />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className={`absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full ${theme.primaryBg} blur-[120px] mix-blend-screen opacity-20`}
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute -bottom-52 -right-40 h-[560px] w-[560px] rounded-full bg-cyan-500/20 blur-[130px] mix-blend-screen`}
          animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,${theme.glowShadow},transparent_55%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.1),transparent_55%)]`} />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-12">
            <HeroImage title={monthLabel} theme={theme} />
          </div>

          <div className="lg:col-span-7">
            <motion.div
              className="rounded-3xl border border-white/10 bg-white/8 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Calendar
                currentMonth={currentMonth}
                onPrevMonth={() => setCurrentMonth((m) => subMonths(m, 1))}
                onNextMonth={() => setCurrentMonth((m) => addMonths(m, 1))}
                startDate={start}
                endDate={end}
                onDayClick={(day) => {
                  if (!startDate || (startDate && endDate)) {
                    setStartDate(day);
                    setEndDate(null);
                    setHoverDate(null);
                  } else {
                    if (isBefore(day, startDate)) {
                      setEndDate(startDate);
                      setStartDate(day);
                    } else {
                      setEndDate(day);
                    }
                    setHoverDate(null);
                  }
                }}
                onDayHover={(day) => {
                  if (startDate && !endDate) {
                    setHoverDate(day);
                  }
                }}
                hoverDate={hoverDate}
                holidays={holidays}
                noteDates={noteDates}
                theme={theme}
              />
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex flex-col h-full">
            <NotesPanel
              rangeKey={rangeKey}
              startDate={start}
              endDate={end}
              value={activeNote}
              onChange={(next) => {
                if (!rangeKey) return;
                setNotes((prev) => ({ ...prev, [rangeKey]: next }));
              }}
              onClear={() => {
                if (!rangeKey) return;
                setNotes((prev) => {
                  const next = { ...prev };
                  delete next[rangeKey];
                  return next;
                });
              }}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
