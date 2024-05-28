import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { ThemeContext } from "../context/context";
import { getTheme } from "../themes/themes";

/**
 * This component provides two features:
 * 1. A theme to all MUI children components.
 * 2. Children component can set `themeMode` by using `useContext(ThemeContext)`,
 *    then set `themeMode` by `setThemeMode()`.
 *
 * `themeMode` default value is `light`. Changing this value will re-render `Theme`
 * to switch different theme.
 *
 * @param {component} children - The children component
 */
export default function Theme({ children }) {
  const [themeMode, setThemeMode] = useState("light");
  const theme = getTheme(themeMode);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
