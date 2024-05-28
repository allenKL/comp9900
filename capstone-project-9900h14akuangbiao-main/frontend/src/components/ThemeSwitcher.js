import { Brightness4, Brightness7 } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../context/context";

/**
 * This component can read and change the theme.
 */
export default function ThemeSwitcher() {
  // console.log(`[ThemeSwitcher] is being rendered.`);

  const { themeMode, setThemeMode } = useContext(ThemeContext);

  return (
    <IconButton
      color="inherit"
      onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
    >
      {themeMode === "light" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
