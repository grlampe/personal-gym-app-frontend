import { createContext, ReactNode, useState } from "react";

export const TitlePageContext = createContext({} as TitlePageContextData);

type TitlePageContextData = {
  pageTitle: string,
  setPageTitle: any,
}

type TitlePageProvider = {
  children: ReactNode,
}

export function TitlePageProvider (props: TitlePageProvider) {
  const [ pageTitle , setPageTitle ] = useState('')

  return (
    <TitlePageContext.Provider value={{pageTitle, setPageTitle}}>
      {props.children}
    </TitlePageContext.Provider>
  )
}