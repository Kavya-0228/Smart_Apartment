import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return { darkMode, toggle: () => setDarkMode(d => !d) };
}
