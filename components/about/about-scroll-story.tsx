"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type Principle = { title: string; description: string };

export function AboutScrollStory({ eyebrow, title, principles }: { eyebrow: string; title: string; principles: Principle[] }) {
  const [active, setActive] = useState(0);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = Number((visible.target as HTMLElement).dataset.storyIndex);
      if (Number.isFinite(index)) setActive(index);
    }, { rootMargin: "-32% 0px -38%", threshold: [0.2, 0.5, 0.8] });
    itemsRef.current.forEach(item => item && observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return <section className="about-story" aria-labelledby="about-story-title">
    <div className="site-container about-story-layout">
      <div className="about-story-sticky">
        <p className="eyebrow">{eyebrow}</p><h2 id="about-story-title">{title}</h2>
        <div className="about-story-progress" aria-hidden="true"><span style={{ "--story-progress": `${((active + 1) / principles.length) * 100}%` } as CSSProperties}/></div>
        <div className="about-story-counter" aria-hidden="true"><strong>{String(active + 1).padStart(2, "0")}</strong><span>/ {String(principles.length).padStart(2, "0")}</span></div>
      </div>
      <div className="about-story-steps">
        {principles.map((principle, index) => <article ref={node => { itemsRef.current[index] = node; }} data-story-index={index} className={index === active ? "about-story-step active" : "about-story-step"} key={principle.title}>
          <span className="about-story-number">{String(index + 1).padStart(2, "0")}</span>
          <div className="about-story-mark" aria-hidden="true"><span/><span/></div>
          <div><h3>{principle.title}</h3><p>{principle.description}</p></div>
        </article>)}
      </div>
    </div>
  </section>;
}
