import { useContext, useEffect } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";

export function HomePage() {
  const titlePageContext = useContext(TitlePageContext);

  useEffect(() =>{
    titlePageContext.setPageTitle('Início');
  },[])

  return (
    <>
      <h1>Olá, seja bem vindo!</h1>
    </>
  )
}