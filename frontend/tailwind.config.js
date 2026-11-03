/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tiktok: {
          bg: '#0a0b10',
          darker: '#06070a',
          card: '#11131f',
          cardSubtle: '#181b2c',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.18)',
          magenta: '#fe2c55',
          magentaHover: '#e0264b',
          cyan: '#00f2fe',
          cyanHover: '#00d6e0',
          yellow: '#ffb800',
          green: '#00e676',
        },
      },
      boxShadow: {
        'glow-magenta': '0 0 20px -3px rgba(254, 44, 85, 0.4)',
        'glow-cyan': '0 0 20px -3px rgba(0, 242, 254, 0.4)',
        'glow-subtle': '0 0 15px -3px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounceShort 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        bounceShort: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-3px)' },
        },
      },
    },
  },
  plugins: [],
};
