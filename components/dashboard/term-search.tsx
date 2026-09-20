"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function TermSearch({ initialQuery, placeholder, countLabel }: { initialQuery: string; placeholder: string; countLabel: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const timer = window.setTimeout(() => {
      const normalized = query.trim();
      if ((searchParams.get("q") ?? "") === normalized && searchParams.get("tab") === "language") return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", "language");
      if (normalized) params.set("q", normalized); else params.delete("q");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 280);
    return () => window.clearTimeout(timer);
  }, [pathname, query, router, searchParams]);

  return <section className="term-toolbar">
    <div className="term-live-search"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></svg><input value={query} onChange={event => setQuery(event.target.value)} maxLength={100} placeholder={placeholder} aria-label={placeholder}/></div>
    <span aria-live="polite">{countLabel}</span>
  </section>;
}
