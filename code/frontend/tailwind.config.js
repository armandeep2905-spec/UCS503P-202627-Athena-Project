/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary:         'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',
        accent:          'var(--color-accent)',
        'accent-hover':  'var(--color-accent-hover)',
        surface:         'var(--color-surface)',
        'surface-alt':   'var(--color-surface-alt)',
        'surface-raised':'var(--color-surface-raised)',
        'on-surface':    'var(--color-on-surface)',
        'on-primary':    'var(--color-on-primary)',
        muted:           'var(--color-muted)',
        border:          'var(--color-border)',
        'border-light':  'var(--color-border-light)',
        danger:          'var(--color-danger)',
        'danger-light':  'var(--color-danger-light)',
        success:         'var(--color-success)',
        'success-light': 'var(--color-success-light)',
        warning:         'var(--color-warning)',
        'warning-light': 'var(--color-warning-light)',
        info:            'var(--color-info)',
        'info-light':    'var(--color-info-light)',
      },
      boxShadow: {
        'theme-sm': 'var(--shadow-sm)',
        'theme-md': 'var(--shadow-md)',
        'theme-lg': 'var(--shadow-lg)',
        'theme-xl': 'var(--shadow-xl)',
      },
      borderRadius: {
        'theme-sm': 'var(--radius-sm)',
        'theme-md': 'var(--radius-md)',
        'theme-lg': 'var(--radius-lg)',
        'theme-xl': 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
}
