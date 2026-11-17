import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  textSize: 'normal' | 'large';
  setTextSize: (size: 'normal' | 'large') => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  lowDataMode: boolean;
  setLowDataMode: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('pathway_theme') as 'light' | 'dark') || 'light';
  });

  const [textSize, setTextSizeState] = useState<'normal' | 'large'>(() => {
    return (localStorage.getItem('pathway_text_size') as 'normal' | 'large') || 'normal';
  });

  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    return localStorage.getItem('pathway_reduced_motion') === 'true';
  });

  const [lowDataMode, setLowDataModeState] = useState<boolean>(() => {
    return localStorage.getItem('pathway_low_data') === 'true';
  });

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('pathway_theme', next);
  };

  const setTextSize = (size: 'normal' | 'large') => {
    setTextSizeState(size);
    localStorage.setItem('pathway_text_size', size);
  };

  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
    localStorage.setItem('pathway_reduced_motion', String(val));
  };

  const setLowDataMode = (val: boolean) => {
    setLowDataModeState(val);
    localStorage.setItem('pathway_low_data', String(val));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (textSize === 'large') {
      root.classList.add('text-lg');
    } else {
      root.classList.remove('text-lg');
    }

    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [theme, textSize, reducedMotion]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        textSize,
        setTextSize,
        reducedMotion,
        setReducedMotion,
        lowDataMode,
        setLowDataMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
