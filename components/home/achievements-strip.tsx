"use client";

import { useEffect, useRef, useState } from "react";

export type AchievementItem = {
  id: string;
  title: string;
  subtitle: string | null;
  isPreview: boolean;
  achievement: { value: number; prefix: string | null; suffix: string | null; position: number };
};

export function HeroAchievements({ achievements, locale }: {
  achievements: AchievementItem[];
  locale: "ar" | "en";
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setStarted(true));
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (achievements.length === 0) return null;

  return <div ref={sectionRef} className="hero-achievements" aria-label={locale === "ar" ? "أرقامنا" : "Our numbers"}>
    {achievements.map(item => <article className="hero-achievement" key={item.id}>
      <p className="hero-achievement-number" aria-label={`${item.achievement.prefix ?? ""}${item.achievement.value}${item.achievement.suffix ?? ""}`}>
        <span>{item.achievement.prefix}</span>
        <CountUp value={item.achievement.value} started={started} locale={locale}/>
        <span>{item.achievement.suffix}</span>
      </p>
      <h2>{item.title}</h2>
    </article>)}
  </div>;
}

function CountUp({ value, started, locale }: { value: number; started: boolean; locale: "ar" | "en" }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!started) return;
    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCurrent(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);
  return <span>{new Intl.NumberFormat(locale).format(current)}</span>;
}
