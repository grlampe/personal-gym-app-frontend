import { User } from "../contexts/auth.context";
import { LoginForm } from "../pages/signIn/signIn.page";
import { storageCompanyId, storageTokenName } from "../utils/consts";

export type LoginData = {
  accessToken: string;
  user: User;
}

export const isAuthenticated = () => localStorage.getItem(storageTokenName) !== null;
export const getToken = () => localStorage.getItem(storageTokenName);
export const getCompanyId = () => localStorage.getItem(storageCompanyId);

export async function signInApi(login: LoginForm, funcToExcAfter: any) {
  funcToExcAfter();
  // await api.post<LoginData>('/auth/sign-in', login).then( res => {
  //   funcToExcAfter(res.data);
  // })
  // .catch(error => {
  //   console.error(error);
  //   if(error.response.data.message){
  //     emitErrorToast(error.response.data.message);
  //   } else {
  //     emitErrorToast(error.message);
  //   }
  // });
}