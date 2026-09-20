"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HeroAchievements, type AchievementItem } from "@/components/home/achievements-strip";

export type HeroSlide = {
  id: string;
  eyebrow: string | null;
  headline: string;
  description: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  portfolioLabel: string;
  portfolioHref: string;
  lightImage: string | null;
  darkImage: string | null;
};

export function Hero({ slides, achievements, locale, labels, direction }: { slides: HeroSlide[]; achievements: AchievementItem[]; locale: "ar" | "en"; labels: { previous: string; next: string; slide: string; mediaPending: string }; direction: "rtl" | "ltr" }) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const wheelLock = useRef(0);
  const count = slides.length;
  const go = useCallback((next: number) => setActive(Math.max(0, Math.min(count - 1, next))), [count]);

  useEffect(() => {
    if (count < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % count), 7000);
    return () => window.clearInterval(timer);
  }, [count]);
  if (count === 0) return null;

  return <section className="hero" dir={direction} aria-roledescription="carousel" aria-label={labels.slide} tabIndex={0}
    onKeyDown={event => {
      if (event.key === "ArrowRight") go(active + (document.dir === "rtl" ? -1 : 1));
      if (event.key === "ArrowLeft") go(active + (document.dir === "rtl" ? 1 : -1));
    }}
    onWheel={event => {
      const now = Date.now();
      if (now < wheelLock.current || Math.abs(event.deltaY) < 20) return;
      const next = event.deltaY > 0 ? active + 1 : active - 1;
      if (next < 0 || next >= count) return;
      event.preventDefault(); wheelLock.current = now + 850; go(next);
    }}
    onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null; }}
    onTouchEnd={event => {
      if (touchStart.current === null) return;
      const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
      if (Math.abs(delta) > 48) go(active + (delta < 0 ? 1 : -1));
      touchStart.current = null;
    }}>
    <div className="hero-glow hero-glow-one"/><div className="hero-glow hero-glow-two"/>
    <div className="site-container hero-grid hero-grid-marketing">
      <div className="hero-copy">
        {slides.map((slide, index) => <article key={slide.id} className="hero-slide" data-active={index === active} aria-hidden={index !== active}>
          {slide.eyebrow && <p className="eyebrow">{slide.eyebrow}</p>}
          <h1>{slide.headline}</h1>
          {slide.description && <p className="hero-description">{slide.description}</p>}
          <div className="hero-actions">
            {slide.ctaLabel && slide.ctaHref && <a className="button button-primary" href={slide.ctaHref}>{slide.ctaLabel}<ArrowIcon/></a>}
            <a className="button button-portfolio" href={slide.portfolioHref}>{slide.portfolioLabel}<ArrowIcon/></a>
          </div>
        </article>)}
        {count > 1 && <div className="carousel-controls">
          <button className="icon-button" onClick={() => go(active - 1)} disabled={active === 0} aria-label={labels.previous}><ArrowIcon/></button>
          <span aria-live="polite">{active + 1} / {count}</span>
          <button className="icon-button" onClick={() => go(active + 1)} disabled={active === count - 1} aria-label={labels.next}><ArrowIcon/></button>
        </div>}
      </div>
      <MarketingVisual />
      <HeroAchievements achievements={achievements} locale={locale} />
    </div>
  </section>;
}

function ArrowIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>; }

function MarketingVisual() {
  return <div className="marketing-visual" aria-hidden="true">
    <div className="marketing-orbit marketing-orbit-outer" />
    <div className="marketing-orbit marketing-orbit-inner" />
    <div className="marketing-dashboard">
      <div className="marketing-dashboard-top"><span /><span /><span /></div>
      <div className="marketing-chart">
        <span /><span /><span /><span /><span />
        <svg viewBox="0 0 240 100"><path d="M5 85C36 82 48 48 78 57s42 20 67-8 46-14 90-42" /></svg>
      </div>
      <div className="marketing-metrics"><span /><span /><span /></div>
    </div>
    <span className="marketing-node marketing-node-target"><TargetIcon /></span>
    <span className="marketing-node marketing-node-growth"><GrowthIcon /></span>
    <span className="marketing-node marketing-node-message"><MessageIcon /></span>
    <span className="marketing-node marketing-node-content"><ContentIcon /></span>
  </div>;
}

function TargetIcon() { return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m15 9 5-5m0 0v4m0-4h-4"/></svg>; }
function GrowthIcon() { return <svg viewBox="0 0 24 24"><path d="M4 18V9m6 9V5m6 13v-6m4 6H2"/></svg>; }
function MessageIcon() { return <svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8m-8 3h5"/></svg>; }
function ContentIcon() { return <svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6V3Z"/><path d="M14 3v5h5M9 12h7m-7 4h7"/></svg>; }
