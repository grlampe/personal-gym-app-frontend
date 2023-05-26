import { toast } from "react-toastify";
import { toastConfig } from "./consts";

export const emitSuccessToast = (message: string) => {
  toast.success(message, toastConfig);
}

export const emitErrorToast = (message: string) => {
  toast.error(message, toastConfig);
}

export const emitWarnToast = (message: string) => {
  toast.warning(message, toastConfig);
}

export const emitInfoToast = (message: string) => {
  toast.info(message, toastConfig);
}