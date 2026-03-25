import { createContext, useContext, useEffect, useState } from "react"

export type ThemeMode = "light" | "dark" | "auto"

interface ThemeContextValue {
  mode: ThemeMode
  setTheme: (next: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "auto"
  const stored = window.localStorage.getItem("theme")
  if (stored === "light" || stored === "dark" || stored === "auto")
    return stored
  return "auto"
}

function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode

  document.documentElement.classList.remove("light", "dark")
  document.documentElement.classList.add(resolved)

  if (mode === "auto") {
    document.documentElement.removeAttribute("data-theme")
  } else {
    document.documentElement.setAttribute("data-theme", mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("auto")

  useEffect(() => {
    const initial = getStoredMode()
    setMode(initial)
    applyThemeMode(initial)
  }, [])

  useEffect(() => {
    if (mode !== "auto") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applyThemeMode("auto")
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [mode])

  function setTheme(next: ThemeMode) {
    setMode(next)
    applyThemeMode(next)
    window.localStorage.setItem("theme", next)
  }

  return (
    <ThemeContext.Provider value={{ mode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
