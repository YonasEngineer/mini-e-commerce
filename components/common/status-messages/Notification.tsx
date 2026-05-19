
'use client'
import  { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '@/state/hook';
import { useAppDispatch } from '@/state/hook';
import { clearNotification } from '@/state/features/notification/notification-slice';
export const Notification = () => {
const dispatch   = useAppDispatch()
const notification  =  useAppSelector((state) => state.notification)
    useEffect(() => {
      if (notification.success === "failed") {
        toast.error(notification.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          toastId: "error1",
          className: "toast-position",
        });
      } else if (notification.success === "succeeded") {
        toast.success(notification.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          toastId: "success1",
          className: "toast-position",
        });
      }
      // Delay the clear notification action
      const timeoutId = setTimeout(() => {
        dispatch(clearNotification());
      }, 1000);

      // Cleanup timeout on component unmount
      return () => clearTimeout(timeoutId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notification.message, notification.success]); // Run effect on status or message change
    
    return (null
        // <div className='toast-position'>
        //     <ToastContainer />
        // </div>
    );
}
