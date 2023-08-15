import { storageCurrentUser, storageTokenName } from './../utils/consts';
import axios from "axios";
import { emitErrorToast } from "../utils/toast.utils";
import { getToken } from "./auth.service";
import { delay } from '../utils/delay.utils';

const api = axios.create({
  baseURL: 'http://localhost:3001/'
});

api.interceptors.request.use(async config => {
  const token = getToken();
    if (!!token) {
      if(config.headers){
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      if (config.url !== '/login') {
        emitErrorToast(`Usuário Inválido!. 
          Verifique o cadastro do usuário que está tentando efetuar esta ação!`);
      }
    }

    return config;
});

api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  const token = getToken();

  if (error?.response?.status === 401 && token) {
    localStorage.removeItem(storageCurrentUser);
    localStorage.removeItem(storageTokenName);

    delay(3200).then(()=> {
      window.location.reload()
    })
  }

  if(error?.response?.data?.message){
    emitErrorToast(error.response.data.message);
  } else {
    emitErrorToast(error.message);
  }

  return Promise.reject(error);
});

export { api };