"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ServiceItem = { id: string; title: string; slug: string; summary: string | null };

export function ServicesCarousel({ services, labels }: {
  services: ServiceItem[];
  labels: { eyebrow: string; title: string; previous: string; next: string; service: string; noImage: string };
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const wheelLock = useRef(0);
  const count = services.length;
  const move = useCallback((delta: number) => setActive(value => (value + delta + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [count, move, paused]);
  if (count === 0) return null;

  const relativePosition = (index: number) => {
    let difference = index - active;
    if (difference > count / 2) difference -= count;
    if (difference < -count / 2) difference += count;
    return Math.max(-2, Math.min(2, difference));
  };

  return <section className="services-showcase" aria-labelledby="home-services-title"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="site-container services-layout">
      <div className="services-copy">
        <p className="eyebrow">{labels.eyebrow}</p>
        <h2 id="home-services-title">{labels.title}</h2>
        <div className="services-controls">
          <button className="service-arrow" onClick={() => move(-1)} aria-label={labels.previous}><Arrow/></button>
          <span aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
          <button className="service-arrow" onClick={() => move(1)} aria-label={labels.next}><Arrow/></button>
        </div>
      </div>
      <div className="services-stack" tabIndex={0} aria-roledescription="carousel" aria-label={labels.service}
        onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
        onKeyDown={event => { if (event.key === "ArrowRight") move(document.dir === "rtl" ? -1 : 1); if (event.key === "ArrowLeft") move(document.dir === "rtl" ? 1 : -1); }}
        onWheel={event => { const now = Date.now(); if (now < wheelLock.current || Math.abs(event.deltaY) < 20) return; wheelLock.current = now + 750; move(event.deltaY > 0 ? 1 : -1); }}
        onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={event => { if (touchStart.current === null) return; const delta = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current; if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1); touchStart.current = null; }}>
        {services.map((service, index) => {
          const position = relativePosition(index);
          return <article key={service.id} className="stacked-service-card" data-position={position} aria-hidden={position !== 0} onClick={() => position !== 0 && move(position)}>
            <span className="stacked-service-index">{String(index + 1).padStart(2, "0")}</span>
            <div className="service-media-placeholder" role="img" aria-label={labels.noImage}>
              <div className="service-glyph" aria-hidden="true"><span/><span/><span/></div><small>{labels.noImage}</small>
            </div>
            <h3>{service.title}</h3>
            {service.summary && <p>{service.summary}</p>}
            <span className="stacked-service-key" dir="ltr">/{service.slug}</span>
          </article>;
        })}
      </div>
    </div>
  </section>;
}

function Arrow() { return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>; }
