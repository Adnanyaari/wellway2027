import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";
export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(getAuth());
