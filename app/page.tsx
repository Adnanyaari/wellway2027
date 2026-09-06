import { redirect } from "next/navigation";
import { getSiteConfig } from "@/lib/env";
import { localizedPath } from "@/lib/i18n/config";

export default function RootPage() { redirect(localizedPath(getSiteConfig().defaultLocale)); }
