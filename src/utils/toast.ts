import { toast } from 'sonner';

/**
 * Display a success toast notification
 * @param title The title of the toast
 * @param description Optional description for the toast
 */
export const showSuccessToast = (title: string, description?: string) => {
  toast.success(title, {
    icon: '🎉',
    description,
    duration: 3000,
  });
};

/**
 * Display an error toast notification
 * @param title The title of the toast
 * @param description Optional description for the toast
 */
export const showErrorToast = (title: string, description?: string) => {
  toast.error(title, {
    description,
    duration: 5000,
  });
};

/**
 * Display an info toast notification
 * @param title The title of the toast
 * @param description Optional description for the toast
 */
export const showInfoToast = (title: string, description?: string) => {
  toast.info(title, {
    description,
    duration: 5000,
  });
};
