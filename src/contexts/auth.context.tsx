import { createContext, ReactNode, useState } from "react";
import { LoginData, signInApi } from "../services/auth.api";
import { storageCompanyId, storageCurrentUser, storageTokenName } from "../utils/consts";

export const AuthContext = createContext({} as AuthContextData);

export type User = {
  companyId: string;
  companyName: string;
  id: string;
  fullName: string;
  email: string;
  accessToken: string;
}

type UserSignInForm = {
  email?: string;
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
    localStorage.removeItem(storageCurrentUser);
    localStorage.removeItem(storageCompanyId);
  }

  async function setUserData(data: LoginData) {
    localStorage.setItem(storageTokenName, '123');
    localStorage.setItem(storageCurrentUser, JSON.stringify({name: 'User'}));
    localStorage.setItem(storageCompanyId, '213123');
    
    setCurrentUser(data.user); 
    if(!!data){
      localStorage.setItem(storageTokenName, '123');
      localStorage.setItem(storageCurrentUser, JSON.stringify({name: 'User'}));
      localStorage.setItem(storageCompanyId, '213123');
      
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