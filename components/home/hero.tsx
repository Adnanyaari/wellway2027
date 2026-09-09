"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

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

export function Hero({ slides, labels }: { slides: HeroSlide[]; labels: { previous: string; next: string; slide: string; mediaPending: string } }) {
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

  return <section className="hero" aria-roledescription="carousel" aria-label={labels.slide} tabIndex={0}
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
    <div className="site-container hero-grid">
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
      <div className={`hero-visual${slides[active]?.lightImage && slides[active]?.darkImage ? " has-image" : ""}`} aria-label={slides[active]?.headline || labels.mediaPending} role="img">
        {slides[active]?.lightImage && slides[active]?.darkImage ? <><div className="hero-icon-orbit" aria-hidden="true"><span><OrbitIcon name="spark"/></span><span><OrbitIcon name="chart"/></span><span><OrbitIcon name="target"/></span><span><OrbitIcon name="message"/></span></div><Image className="hero-image hero-image-light" src={slides[active].lightImage} alt={slides[active].headline} fill priority unoptimized/><Image className="hero-image hero-image-dark" src={slides[active].darkImage} alt={slides[active].headline} fill priority unoptimized/></> : <><div className="brand-orbit"><span>W</span><span>W</span></div><p>{labels.mediaPending}</p></>}
      </div>
    </div>
  </section>;
}

function ArrowIcon() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>; }

function OrbitIcon({ name }: { name: "spark" | "chart" | "target" | "message" }) {
  const paths = {
    spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>,
    chart: <><path d="M5 18V9M12 18V5M19 18v-6"/><path d="M3 20h18"/></>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m15 9 5-5"/></>,
    message: <path d="M4 5h16v11H9l-5 4V5Z"/>,
  };
  return <svg viewBox="0 0 24 24">{paths[name]}</svg>;
}
