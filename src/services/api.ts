import axios from "axios";
import { emitErrorToast } from "../utils/toast.utils";
import { getToken } from "./auth.api";

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

export { api };