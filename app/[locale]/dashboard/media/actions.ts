"use server";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/features/auth/guards";
import { storeImage } from "@/features/media/storage";
import { isLocale, localizedPath } from "@/lib/i18n/config";
export async function uploadMedia(formData: FormData) {
  const localeValue = String(formData.get("locale") || "");
  if (!isLocale(localeValue)) return;
  const principal = await requirePermission("media.upload", localeValue);
  const file = formData.get("file");
  if (!(file instanceof File)) return;
  await storeImage(principal, file, "media-library");
  revalidatePath(localizedPath(localeValue, "/dashboard/media"));
}
