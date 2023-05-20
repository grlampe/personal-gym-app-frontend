import { createContext, ReactNode, useState, useEffect } from "react";
import { LoginData, signInApi } from "../services/auth.api";
import { storageCurrentUser, storageTokenName } from "../utils/consts";

export const AuthContext = createContext({} as AuthContextData);

export type User = {
  id : string; 
  email : string; 
  name : string;
  active : boolean;  
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
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(storageCurrentUser);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  function signOut() {
    setCurrentUser(null);
    localStorage.removeItem(storageCurrentUser);
    localStorage.removeItem(storageTokenName);
  }

  async function setUserData(data: LoginData) {
    if (!!data) {
      localStorage.setItem(storageTokenName, data.access_token);
      localStorage.setItem(storageCurrentUser, JSON.stringify(data.user));
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