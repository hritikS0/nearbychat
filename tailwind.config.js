/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Your existing brand colors (preserved)
        bg: {
          primary: "#0A0A0A",
          secondary: "#121212",
          elevated: "#1A1A1A",
          tertiary: "#242424",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#A1A1AA",
          muted: "#71717A",
          inverse: "#0A0A0A",
        },
        border: {
          DEFAULT: "#27272A",
          subtle: "#1F1F22",
          accent: "#A3FF12",
        },
        
        // Proximity & Status Colors
        proximity: {
          mint: "#2DD4BF",     // <100m - very close
          indigo: "#4F46E5",   // 100-500m - medium range
          slate: "#64748B",    // 500-1000m - far range
          warning: "#F59E0B",  // Signal weak
        },
        
        // Your existing accent preserved
        accent: {
          DEFAULT: "#A3FF12",
          glow: "#D4FF5E",
          muted: "#6B8C0D",
        },
        
        // Semantic colors
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
        
        // Online status
        online: "#22C55E",
        offline: "#6B7280",
      },
      
      fontFamily: {
        // Inter is the gold standard for modern mobile apps
        sans: ["Inter_18pt-Regular", "System", "ui-sans-serif"],
        "sans-medium": ["Inter_18pt-Medium", "System"],
        "sans-semibold": ["Inter_18pt-SemiBold", "System"],
        "sans-bold": ["Inter_18pt-Bold", "System"],
      },
      
      fontSize: {
        "xs": ["12px", { lineHeight: "16px" }],
        "sm": ["14px", { lineHeight: "20px" }],
        "base": ["16px", { lineHeight: "24px" }],
        "lg": ["18px", { lineHeight: "28px" }],
        "xl": ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
      },
      
      spacing: {
        "18": "72px",
        "88": "352px",
        "100": "400px",
      },
      
      borderRadius: {
        "lg": "12px",
        "xl": "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      
      boxShadow: {
        "glow-accent": "0 0 20px -5px rgba(163, 255, 18, 0.5)",
        "glow-mint": "0 0 20px -5px rgba(45, 212, 191, 0.5)",
        "glow-indigo": "0 0 20px -5px rgba(79, 70, 229, 0.5)",
        "card": "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
        "elevated": "0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
      },
      
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-slow": "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "radar-scan": "spin 4s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "shake": "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
      },
      
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: 1, filter: "brightness(1)" },
          "50%": { opacity: 0.8, filter: "brightness(1.2)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "slide-down": {
          from: { transform: "translateY(-100%)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
        "fade-in": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "shake": {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },
      
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
      },
      
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};