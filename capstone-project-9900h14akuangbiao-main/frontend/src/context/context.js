import React from "react";

/**
 * `ThemeContext` provides theme context to children and also can let children
 * switch to different theme using `setThemeMode`.
 */
export const ThemeContext = React.createContext({
  themeMode: "",
  setThemeMode: () => {},
});
