"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import * as React from "react";

function IconSolana(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/solana.svg"
      alt="Solana"
      width="20"
      height="20"
      className="size-5"
      {...props}
    />
  );
}

const themes = [
  { value: "light", label: "Light", icon: IconSun },
  { value: "dark", label: "Dark", icon: IconMoon },
  { value: "solana", label: "Solana", icon: IconSolana },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];
  const Icon = currentTheme.icon;
  const isSolana = theme === "solana";

  const handleThemeChange = (value: string) => {
    setTheme(value);
    setOpen(false);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled>
        <IconSun className="size-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Current theme: ${currentTheme.label}. Click to change theme`}
          className={`
            relative transition-transform hover:scale-105 active:scale-95
            backdrop-blur-md border shadow-lg
            ${
              isSolana
                ? "bg-[#14F195]/10 border-[#14F195]/30 hover:bg-[#14F195]/20 hover:border-[#14F195]/40"
                : "bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/30"
            }
          `}
        >
          {Icon === IconSolana ? (
            <Icon className="size-5 transition-opacity" />
          ) : (
            <Icon className="size-5 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={`
          w-40 p-1 rounded-xl border backdrop-blur-lg shadow-xl
          transition-all duration-300
          ${
            isSolana
              ? "bg-[#0a0a0f]/80 border-[#9945FF]/30"
              : "bg-white/20 dark:bg-black/30 border-white/20 dark:border-white/10"
          }
        `}
      >
        {themes.map((t) => {
          const ThemeIcon = t.icon;
          const isSelected = theme === t.value;
          
          return (
            <button
              key={t.value}
              onClick={() => handleThemeChange(t.value)}
              className={`
                w-full flex items-center gap-2.5 px-2 py-1.5 text-sm rounded-md
                transition-all cursor-pointer
                ${
                  isSolana
                    ? isSelected
                      ? "bg-gradient-to-r from-[#14F195]/25 to-[#9945FF]/25 text-[#14F195] font-medium backdrop-blur-sm border border-[#14F195]/20"
                      : "text-gray-300 hover:bg-[#9945FF]/20 hover:text-[#9945FF]"
                    : isSelected
                    ? "bg-white/30 dark:bg-white/20 text-foreground font-medium backdrop-blur-sm"
                    : "text-muted-foreground hover:bg-white/25 dark:hover:bg-white/10"
                }
              `}
            >
              <ThemeIcon className="size-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}