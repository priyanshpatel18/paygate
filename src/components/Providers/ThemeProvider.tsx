"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ComponentProps, useEffect } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('paygate-theme');
      if (!storedTheme) {
        document.documentElement.classList.add('solana');
        localStorage.setItem('paygate-theme', 'solana');
      }
    }
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="solana"
      enableSystem={false}
      storageKey="paygate-theme"
      disableTransitionOnChange
      themes={["light", "dark", "solana"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}