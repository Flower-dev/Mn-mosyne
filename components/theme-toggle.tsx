"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ iconOnly = false }: { iconOnly?: boolean }) {
  const { theme, setTheme } = useTheme();

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Button
      variant="ghost"
      size={iconOnly ? "icon-sm" : "sm"}
      className={
        iconOnly
          ? "text-muted-foreground"
          : "w-full justify-start gap-3 px-3 text-muted-foreground"
      }
      onClick={toggle}
      title="Toggle theme"
    >
      <Sun className="size-4 shrink-0 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 shrink-0 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      {!iconOnly && <span>Toggle theme</span>}
    </Button>
  );
}
