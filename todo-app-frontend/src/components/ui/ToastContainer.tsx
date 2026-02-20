import { Toaster } from 'react-hot-toast';
import { defaultToastOptions } from '../../utils/toast';

const ToastContainer = () => (
  <Toaster
    position="top-right"
    toastOptions={defaultToastOptions}
  />
);

export default ToastContainer;
