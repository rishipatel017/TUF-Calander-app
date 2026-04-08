import {
  addDays,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export function generateCalendarDays(month: Date) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });

  const days: Date[] = [];
  let current = start;

  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}
