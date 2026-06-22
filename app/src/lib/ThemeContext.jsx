import { createContext, useContext, useState } from 'react';
import {
  semantic as darkSemantic, semanticNP,
  fonts as darkFonts, fontsNP,
  feelConfig as darkFeelConfig,
  colors,
} from './theme';

// ─── Feel configs per theme ───────────────────────────────────────────────────

const feelConfigNP = {
  Stoked: {
    color:        colors.green[100],
    shadow:       colors.green[100],
    label:        '🤙 Stoked',
    activeColor:  'rgba(61,107,82,0.25)',
    activeBorder: colors.green[100],
    glow:         colors.green[100],
  },
  Chilled: {
    color:        colors.blue[100],
    shadow:       colors.blue[100],
    label:        '🥶 Chilled',
    activeColor:  'rgba(45,95,168,0.25)',
    activeBorder: colors.blue[100],
    glow:         colors.blue[100],
  },
  Drippin: {
    color:        colors.red[100],
    shadow:       colors.red[100],
    label:        '🥵 Drippin',
    activeColor:  'rgba(140,46,46,0.25)',
    activeBorder: colors.red[100],
    glow:         colors.red[100],
  },
};

// ─── Theme definitions ────────────────────────────────────────────────────────

const themes = {
  dark: {
    name:       'dark',
    label:      'Theme 1 — Dark',
    semantic:   darkSemantic,
    fonts:      darkFonts,
    feelConfig: darkFeelConfig,
  },
  nationalPark: {
    name:       'nationalPark',
    label:      'Theme 2 — National Park',
    semantic:   semanticNP,
    fonts:      fontsNP,
    feelConfig: feelConfigNP,
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext(themes.dark);

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem('appTheme') || 'nationalPark'
  );

  function applyTheme(name) {
    localStorage.setItem('appTheme', name);
    setThemeName(name);
  }

  const value = {
    ...themes[themeName] ?? themes.dark,
    themeName,
    applyTheme,
    themeOptions: Object.values(themes).map(t => ({ name: t.name, label: t.label })),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
