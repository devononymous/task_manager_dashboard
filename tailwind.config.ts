// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // This enables class-based dark mode
  theme: {
    extend: {
      // Optional: Custom themes or colors here
    },
  },
  plugins: [],
}

export default config
