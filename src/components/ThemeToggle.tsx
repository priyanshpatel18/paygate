"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
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
          className="relative transition-transform hover:scale-105 active:scale-95"
        >
          {Icon === IconSolana ? (
            <Icon className="size-5 transition-opacity" />
          ) : (
            <Icon className="size-5 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {themes.map((t) => {
          const ThemeIcon = t.icon;
          const isSelected = theme === t.value;
          return (
            <button
              key={t.value}
              onClick={() => handleThemeChange(t.value)}
              className={`w-full flex items-center gap-2.5 px-2 py-1.5 text-sm rounded-sm transition-colors cursor-pointer ${isSelected
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
            >
              {ThemeIcon === IconSolana ? (
                <ThemeIcon className="size-4" />
              ) : (
                <ThemeIcon className="size-4" />
              )}
              <span>{t.label}</span>
            </button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}