import baseToast, { Toaster, type ToastOptions, type DefaultToastOptions } from 'react-hot-toast';

const DEFAULT_DURATION = 4000;

const defaultToastOptions: DefaultToastOptions = {
  duration: DEFAULT_DURATION,
  style: {
    background: '#1f2937',
    color: '#f9fafb'
  },
  success: {
    iconTheme: { primary: '#10b981' }
  },
  error: {
    iconTheme: { primary: '#ef4444' }
  }
};

/**
 * Unified toast API for the app. Use across all pages for success, error, warning, and info messages.
 */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    baseToast.success(message, { ...defaultToastOptions.success, ...options }),

  error: (message: string, options?: ToastOptions) =>
    baseToast.error(message, { ...defaultToastOptions.error, ...options }),

  warning: (message: string, options?: ToastOptions) =>
    baseToast(message, {
      icon: '⚠️',
      style: {
        ...defaultToastOptions.style,
        background: '#b45309',
        color: '#fef3c7'
      },
      duration: options?.duration ?? DEFAULT_DURATION,
      ...options
    }),

  info: (message: string, options?: ToastOptions) =>
    baseToast(message, {
      icon: 'ℹ️',
      style: {
        ...defaultToastOptions.style,
        background: '#1e40af',
        color: '#dbeafe'
      },
      duration: options?.duration ?? DEFAULT_DURATION,
      ...options
    }),

  /** Raw toast for custom use (e.g. loading, custom content). */
  custom: baseToast
};

export { Toaster, defaultToastOptions };
