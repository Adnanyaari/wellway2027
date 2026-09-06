import "server-only";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import type { Locale } from "./config";

export type Messages = typeof en;
const dictionaries: Record<Locale, Messages> = { ar, en };
export function getMessages(locale: Locale): Messages { return dictionaries[locale]; }
