
"use client"

import * as React from "react"
import { Moon, Sun, Laptop } from "lucide-react" // Added Laptop for system theme
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (!mounted) return;

    const currentTheme = theme === 'system' ? 'system' : theme;
    const currentIndex = themes.indexOf(currentTheme || 'system');
    let nextIndex = (currentIndex + 1) % themes.length;
    
    // Ensure 'system' is part of the cycle if not explicitly first/last
    // Simple cycle: system -> light -> dark -> system
    if (theme === 'system') {
        setTheme('light');
    } else if (theme === 'light') {
        setTheme('dark');
    } else {
        setTheme('system');
    }
  }

  if (!mounted) {
    // Render a placeholder or null to avoid hydration mismatch
    return <Button variant="ghost" size="icon" disabled><Laptop className="h-[1.2rem] w-[1.2rem]" /></Button>;
  }

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme} aria-label="Toggle theme">
      {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />}
      {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />}
      {theme === "system" && <Laptop className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
