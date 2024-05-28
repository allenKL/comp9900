import { createTheme } from "@mui/material/styles";

/**
 * This function calculate a new theme by using `themeMode` and return it.
 * 
 * @param {string} themeMode - The mode of the theme.
 * @returns The theme
 */
export function getTheme(themeMode) {
  return createTheme({ palette: { mode: themeMode } });
}
