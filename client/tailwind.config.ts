
  import type { Config } from "tailwindcss";

  export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          cinema: {
            primary: "#000000", // Чёрный фон сайта
            secondary: "#0F0F0F", // Тёмный оттенок
            accent: "#40409c", // Синий акцент
            mouse: "#2d2d69",
            text: "#E2E8F0", // Светлый текст
            gold: "#FCD34D", // Золотой для VIP
            "seat-standard": "#3B82F6", // Синий для стандартных мест
            "seat-vip": "#F59E0B", // Золотой для VIP мест
            "seat-kids": "#10B981", // Зеленый для детских мест
            "seat-selected": "#E11D48", // Красный для выбранных мест
            "seat-reserved": "#6B7280", // Серый для забронированных мест
          },
          // Добавляем цвета из CSS переменных
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          card: "hsl(var(--card))",
          "card-foreground": "hsl(var(--card-foreground))",
          border: "hsl(var(--border))",
        },
        width: {
          "120%": "120%", // Добавляем нестандартную ширину
        },
        backgroundImage: {
          // Градиенты для фона
          "gradient-cinema": "linear-gradient(to bottom, #0F172A, #111827)",
          "gradient-poster": "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))",
        },
        boxShadow: {
          soft: "0 2px 10px rgba(0, 0, 0, 0.1)",
          medium: "0 4px 20px rgba(0, 0, 0, 0.15)",
          glass: "0 8px 32px rgba(0, 0, 0, 0.2)",
        },
        fontFamily: {
          sans: ["Montserrat", "sans-serif"], // Основной шрифт
          racing: ['"Racing Sans One"', 'sans-serif'], // Дополнительный шрифт
        },
        keyframes: {
          fadeIn: {
            from: { opacity: "0" },
          to: { opacity: "1" },
          },
          slideIn: {
            from: { transform: "translateX(20px)" },
          to: { transform: "translateX(0)" },
          }
        },
        animation: {
         "fade-in": "fade-in 0.2s ease-in-out",
        "slide-in-from-right-20": "slide-in-from-right-20 0.2s ease-in-out",  
        },
      },
    },
      plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require('tailwindcss-animate'),
  ],
  } satisfies Config;
