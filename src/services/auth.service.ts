import { User } from "../contexts/auth.context";
import { LoginForm } from "../pages/signIn/signIn.page";
import { storageTokenName } from "../utils/consts";
import { api } from "./api.service";

export type LoginData = {
  access_token: string;
  user: User;
}

export const isAuthenticated = () => localStorage.getItem(storageTokenName) !== null;
export const getToken = () => localStorage.getItem(storageTokenName);

export async function signInApi(login: LoginForm, funcToExcAfter: any) {
   await api.post<LoginData>('/login', login).then( res => {
     funcToExcAfter(res.data);
   })
}