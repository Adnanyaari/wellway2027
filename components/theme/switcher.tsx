"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
export function ThemeSwitcher({ labels }: { labels: { theme: string; light: string; dark: string; system: string } }) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return <label className="flex items-center gap-3">
    <span>{labels.theme}</span>
    <select aria-label={labels.theme} value={mounted ? theme : "system"} disabled={!mounted}
      onChange={event => setTheme(event.target.value)} className="rounded border border-current bg-background px-3 py-2">
      <option value="light">{labels.light}</option><option value="dark">{labels.dark}</option>
      <option value="system">{labels.system}</option>
    </select>
  </label>;
}
