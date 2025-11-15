import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getSettings, updateSettings } from '../services/settingsService';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement;
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', isDark);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // `rawSetTheme` là hàm set state gốc, `setTheme` là hàm public được cung cấp cho context
  const [theme, rawSetTheme] = useState<Theme>('system');

  // Effect này CHỈ chạy MỘT LẦN khi component được mount để lấy theme ban đầu
  useEffect(() => {
    const fetchInitialTheme = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const settings = await getSettings();
          rawSetTheme(settings.theme); // Chỉ cập nhật state, không gây ra các side effect khác
        } catch (error) {
          console.error("Failed to fetch theme settings, using system default.", error);
          rawSetTheme('system'); // Nếu lỗi, quay về mặc định
        }
      } else {
        // Nếu không đăng nhập, dùng theme hệ thống
        rawSetTheme('system');
      }
    };

    fetchInitialTheme();
  }, []); // Mảng dependency rỗng đảm bảo nó chỉ chạy một lần

  // Effect này chạy MỖI KHI `theme` thay đổi.
  // Nhiệm vụ của nó là áp dụng theme lên DOM và lắng nghe thay đổi của hệ thống.
  useEffect(() => {
    applyTheme(theme); // Áp dụng theme hiện tại lên DOM

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Hàm xử lý khi theme hệ thống thay đổi
    const handleChange = () => {
      // Chỉ áp dụng lại nếu người dùng đang ở chế độ 'system'
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]); // Chạy lại mỗi khi state `theme` thay đổi


  // Hàm được cung cấp cho các component con để thay đổi theme
  const setTheme = useCallback((newTheme: Theme) => {
    // 1. Cập nhật state nội bộ của React
    rawSetTheme(newTheme);
    
    // 2. Lưu cài đặt mới vào backend (nếu đã đăng nhập)
    const token = localStorage.getItem('token');
    if (token) {
      updateSettings(newTheme).catch(error => {
        // Nếu lưu thất bại, có thể thông báo cho người dùng hoặc chỉ log lỗi
        console.error("Failed to save theme settings:", error);
      });
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};