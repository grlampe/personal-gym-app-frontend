import { storageCurrentUser, storageTokenName } from './../utils/consts';
import axios from "axios";
import { emitErrorToast, emitInfoToast } from "../utils/toast.utils";
import { getToken } from "./auth.service";
import { delay } from '../utils/delay.utils';

const api = axios.create({
  baseURL: 'http://localhost:3001/'
});

api.interceptors.request.use(async config => {
  const token = getToken();
  
  if (!!token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

function clearAuthentication() {
  localStorage.removeItem(storageCurrentUser);
  localStorage.removeItem(storageTokenName);
}

function redirectToLogin() {
  delay(2600).then(()=> {
    window.location.href = '/';
  })
}

api.interceptors.response.use(async (response) => response,
  async (error) => {
    const token = getToken()
    if (error?.response?.status === 401 && token) {
      emitInfoToast('Usuário Expirado!');
      clearAuthentication();
      redirectToLogin();
      return;
    }
    
    let errorMessage = error?.response?.data?.message;
    if (!errorMessage) {
      errorMessage = error?.message;
    }
    
    emitErrorToast(errorMessage);

    return Promise.reject(error);
  }
);

export { api };