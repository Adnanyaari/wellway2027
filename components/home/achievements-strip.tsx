"use client";

import { useEffect, useRef, useState } from "react";

type AchievementItem = {
  id: string;
  title: string;
  subtitle: string | null;
  isPreview: boolean;
  achievement: { value: number; prefix: string | null; suffix: string | null; position: number };
};

export function AchievementsStrip({ achievements, label, locale }: {
  achievements: AchievementItem[];
  label: string;
  locale: "ar" | "en";
}) {
  const sectionRef = useRef<HTMLElement>(null);
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

  return <section ref={sectionRef} className="achievements-strip" aria-labelledby="achievements-title">
    <div className="site-container achievements-inner">
      <p className="achievements-label" id="achievements-title">
        {label}
        {achievements.some(item => item.isPreview) && <small>{locale === "ar" ? "بيانات تجريبية" : "Demo data"}</small>}
      </p>
      <div className="achievements-grid">
        {achievements.map(item => <article className="achievement-item" key={item.id}>
          <p className="achievement-number" aria-label={`${item.achievement.prefix ?? ""}${item.achievement.value}${item.achievement.suffix ?? ""}`}>
            <span>{item.achievement.prefix}</span>
            <CountUp value={item.achievement.value} started={started} locale={locale}/>
            <span>{item.achievement.suffix}</span>
          </p>
          <h2>{item.title}</h2>
          {item.subtitle && <p className="achievement-subtitle">{item.subtitle}</p>}
        </article>)}
      </div>
    </div>
  </section>;
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
