import "server-only";
import { cache } from "react";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import { getDb } from "@/db/client";
import type { Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

export const UI_MESSAGES_SETTING_KEY = "ui.messages";
type Overrides = { version: 1; ar: Record<string, string>; en: Record<string, string> };

export function isSafeMessageKey(key: string) {
  const parts = key.split(".");
  return /^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*$/.test(key) &&
    parts.every(part => !["__proto__", "prototype", "constructor"].includes(part));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function parseOverrides(value: unknown): Overrides {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.ar) || !isRecord(value.en)) {
    return { version: 1, ar: {}, en: {} };
  }
  const clean = (input: Record<string, unknown>) => Object.fromEntries(Object.entries(input).filter(([key, text]) =>
    isSafeMessageKey(key) && typeof text === "string" && text.length <= 2000,
  )) as Record<string, string>;
  return { version: 1, ar: clean(value.ar), en: clean(value.en) };
}

export function flattenMessages(value: unknown, prefix = ""): Record<string, string> {
  if (typeof value === "string") return prefix ? { [prefix]: value } : {};
  if (!value || typeof value !== "object") return {};
  return Object.entries(value).reduce<Record<string, string>>((all, [key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return Object.assign(all, flattenMessages(child, path));
  }, {});
}

function setPath(target: unknown, path: string, value: string) {
  const parts = path.split(".");
  let cursor = target as Record<string, unknown>;
  for (let index = 0; index < parts.length - 1; index++) {
    const part = parts[index];
    if (!part || ["__proto__", "prototype", "constructor"].includes(part)) return;
    const next = cursor[part];
    if (!next || typeof next !== "object") cursor[part] = {};
    cursor = cursor[part] as Record<string, unknown>;
  }
  const leaf = parts.at(-1);
  if (leaf && !["__proto__", "prototype", "constructor"].includes(leaf)) cursor[leaf] = value;
}

export async function getUiMessageOverrides() {
  const setting = await getDb().siteSetting.findUnique({ where: { key: UI_MESSAGES_SETTING_KEY }, select: { value: true } });
  return parseOverrides(setting?.value);
}

export const getRuntimeMessages = cache(async (locale: Locale): Promise<Messages> => {
  const defaults = locale === "ar" ? ar : en;
  const messages = structuredClone(defaults) as Messages;
  const overrides = await getUiMessageOverrides();
  for (const [path, value] of Object.entries(overrides[locale])) setPath(messages, path, value);
  return messages;
});

export async function listUiMessages(query = "") {
  const overrides = await getUiMessageOverrides();
  const defaultsAr = flattenMessages(ar);
  const defaultsEn = flattenMessages(en);
  const keys = new Set([...Object.keys(defaultsAr), ...Object.keys(defaultsEn), ...Object.keys(overrides.ar), ...Object.keys(overrides.en)]);
  const needle = query.trim().toLocaleLowerCase();
  return [...keys].sort().map(key => ({
    key,
    ar: overrides.ar[key] ?? defaultsAr[key] ?? "",
    en: overrides.en[key] ?? defaultsEn[key] ?? "",
    overridden: key in overrides.ar || key in overrides.en,
  })).filter(item => !needle || `${item.key} ${item.ar} ${item.en}`.toLocaleLowerCase().includes(needle));
}
