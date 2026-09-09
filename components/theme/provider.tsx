import type { ReactNode } from "react";

export function AppThemeProvider({ children }: { children: ReactNode; nonce?: string }) {
  return children;
}
