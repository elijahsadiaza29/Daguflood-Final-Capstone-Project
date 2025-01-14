import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'system' | 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mapTheme: Theme;
  setMapTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode; defaultTheme: Theme; storageKey: string }> = ({ children, defaultTheme, storageKey }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mapTheme, setMapTheme] = useState<Theme>(defaultTheme);

  // Save the UI theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(storageKey, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, storageKey]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleSetMapTheme = (newTheme: Theme) => {
    setMapTheme(newTheme);
    localStorage.setItem(`${storageKey}-map`, newTheme); // Store map theme separately if needed
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, mapTheme, setMapTheme: handleSetMapTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
