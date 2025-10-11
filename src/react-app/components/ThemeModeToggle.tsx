import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"


export function ModeToggle() {
  const { setTheme } = useTheme()
  let currentTheme = localStorage.getItem("vite-ui-theme")

  function toggleTheme() {
    console.log("Current theme:", currentTheme)
    if (currentTheme === "light") {
      setTheme("dark")
      currentTheme = "dark"
    } else {
      setTheme("light")
      currentTheme = "light"
    }
    console.log("Now theme:", currentTheme)
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-black" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
    </Button>
  )
}