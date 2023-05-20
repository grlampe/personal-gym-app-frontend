import { ToastOptions } from "react-toastify";

//Toast Section
export const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}


export const storageTokenName = '@personal:token';
export const storageCurrentUser = '@smart:currentUser';