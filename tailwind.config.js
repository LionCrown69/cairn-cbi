/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ground: '#1B1F16',
        'deep-ground': '#0E120A',
        surface: '#252A1E',
        ink: '#F1F0EA',
        mute: '#A4A99A',
        signal: '#D4F53C',
        caution: '#FF8A3D',
        line: '#3A4030',
        severed: '#525946',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-signal': '0 0 25px rgba(212, 245, 60, 0.35)',
        'glow-caution': '0 0 25px rgba(255, 138, 61, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      lineHeight: {
        'tight-display': '0.86',
      }
    },
  },
  plugins: [],
}
