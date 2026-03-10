/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: { center: true, padding: '1.5rem' },
    extend: {
      colors: {
        ebony: '#0f172a',
        'soft-cream': '#f7eef6',
        'warm-clay': '#c89a4b',
        'deep-gold': '#c89a4b',
        'cloud-gray': '#e5e7eb',
        'lumimar-primary': '#7b2c3f',
        'lumimar-secondary': '#c89a4b',
        'lumimar-base': '#f7eef6',
        'lumimar-dark': '#0f172a',
        'lumimar-soft': '#e9d7ff',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        card: '0 28px 80px -36px rgba(15, 23, 42, 0.38)',
        soft: '0 22px 60px -32px rgba(15, 23, 42, 0.28)',
      },
      transitionDuration: {
        150: '150ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};
