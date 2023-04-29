import { createContext, ReactNode, useState } from "react";

export const ButtonMenuContext = createContext({} as ButtonMenuContextData);

type ButtonMenuContextData = {
  searchPressed: boolean,
  setSearchPressed: any,
  urlToNew: string,
  setUrlToNew: any,  
}

type ButtonMenuProvider = {
  children: ReactNode,
}

export function ButtonMenuProvider (props: ButtonMenuProvider) {
  const [ urlToNew , setUrlToNew ] = useState('');
  const [ searchPressed , setSearchPressed ] = useState(false);


  return (
    <ButtonMenuContext.Provider value={{
      searchPressed, 
      urlToNew,
      setSearchPressed,
      setUrlToNew
    }}>
      {props.children}
    </ButtonMenuContext.Provider>
  )
}