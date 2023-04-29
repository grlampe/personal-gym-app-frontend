import axios from "axios";
import { emitErrorToast } from "../utils/toast.utils";
import { getCompanyId, getToken } from "./auth.api";

export const baseURLWithoutVersion = 'http://localhost:3001';

const api = axios.create({
  baseURL: `${baseURLWithoutVersion}/api/v1`
});

api.interceptors.request.use(async config => {
  const token = getToken();
  const companyId = getCompanyId();
  if (token) {
    if(config.headers){
      config.headers.Authorization = `Bearer ${token}`;

      if(companyId){
        config.headers.company_id = companyId;
      } else {
        emitErrorToast(`Empresa do usuário inválida. 
          Verifique o cadastro do usuário que está tentando efetuar esta ação!`);
      }
    }
  }
  return config;
});

export { api };