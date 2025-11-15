
// API configuration
export const API_CONFIG = {
  // Environment variable keys
  ENV_KEYS: {
    GEMINI_API_KEY: "VITE_GEMINI_API_KEY",
  },
  
  // Default values
  DEFAULTS: {
    MODEL: "gemini-2.5-flash",
  },
} as const;

// Helper function to get API key
export const getApiKey = (): string | undefined => {
  return import.meta.env.VITE_GEMINI_API_KEY;
};
