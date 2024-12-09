import { toast } from 'react-toastify';

interface ToastProps {
  message: string;
}

export const showSuccessToast = ({ message }: ToastProps) => {
  toast.success(
    <div className="toast-content">
     
      <div className="toast-message">{message}</div>
    </div>
  );
};

export const showErrorToast = ({ message }: ToastProps) => {
  toast.error(
    <div className="toast-content">
     
      <div className="toast-message">{message}</div>
    </div>
  );
};