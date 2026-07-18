"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 rounded-full text-muted-foreground"
        aria-label="Design wechseln"
        tabIndex={-1}
        aria-hidden
      >
        <Moon className="size-5 opacity-40" strokeWidth={1.5} />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="shrink-0 rounded-full text-muted-foreground hover:text-foreground"
      onClick={toggleTheme}
      aria-label={isDark ? "Hellmodus aktivieren" : "Dunkelmodus aktivieren"}
      title={isDark ? "Hellmodus" : "Dunkelmodus"}
    >
      {isDark ? (
        <Sun className="size-5" strokeWidth={1.5} />
      ) : (
        <Moon className="size-5" strokeWidth={1.5} />
      )}
    </Button>
  );
}
