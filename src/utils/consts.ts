import { ToastOptions } from "react-toastify";

//Toast Section
export const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  pauseOnFocusLoss: false,
  closeButton: false
}


export const storageTokenName = '@personal:token';
export const storageCurrentUser = '@smart:currentUser';