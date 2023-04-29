import { createContext, ReactNode, useState } from "react";
import { LoginData, signInApi } from "../services/auth.api";
import { storageTokenName } from "../utils/consts";

export const AuthContext = createContext({} as AuthContextData);

export type User = {
  id: string;
  name: string;
  email: string;
  active: string;
}

type UserSignInForm = {
  username?: string;
  password?: string;
}

type AuthContextData = {
  currentUser: User | null;
  signIn: (user: UserSignInForm) => Promise<void>;
  signOut: () => void;
}

type AuthProvider = {
  children: ReactNode,
}


export const AuthProvider = (props: AuthProvider) => {
  const [ currentUser , setCurrentUser ] = useState<User | null>(null);
  
  function signOut() {
    setCurrentUser(null);
    localStorage.removeItem(storageTokenName);
  }

  async function setUserData(data: LoginData) {
    if(!!data?.access_token){
      localStorage.setItem(storageTokenName, data.access_token);
      
      setCurrentUser(data.user); 
    }
  }
  
  async function signIn(user: UserSignInForm): Promise<void> {
    await signInApi(user, setUserData);
  }

  return (
    <AuthContext.Provider value={{currentUser, signOut, signIn}}>
      {props.children}
    </AuthContext.Provider>
  )
}