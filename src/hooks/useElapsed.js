import { useEffect, useState } from "react";

// Fecha en que empezaron a hablar. Cámbiala aquí (año-mes-díaTHH:MM:SS, hora local).
export const SINCE = new Date("2026-09-01T00:00:00");

// Hitos que se celebran, en días
const MILESTONES = [30, 60, 100, 150, 200, 250, 300, 365, 500, 730, 1000, 1500, 2000];

export function getElapsed() {
  const total = Math.max(0, Math.floor((Date.now() - SINCE.getTime()) / 1000));
  const days = Math.floor(total / 86400);
  const next = MILESTONES.find((m) => m > days) ?? Math.ceil((days + 1) / 500) * 500;
  const prev = [...MILESTONES].reverse().find((m) => m <= days) ?? 0;
  return {
    total,
    days,
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    totalHours: Math.floor(total / 3600),
    totalMinutes: Math.floor(total / 60),
    next,
    daysToNext: next - days,
    milestoneProgress: (days - prev) / (next - prev),
  };
}

/** Tiempo transcurrido, actualizado cada segundo. */
export function useElapsed() {
  const [t, setT] = useState(getElapsed);
  useEffect(() => {
    const id = setInterval(() => setT(getElapsed()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export const pad = (n) => String(n).padStart(2, "0");
export const fmt = (n) => n.toLocaleString("es");
