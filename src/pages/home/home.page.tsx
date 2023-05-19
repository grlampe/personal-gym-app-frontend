import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth.context";
import { TitlePageContext } from "../../contexts/titlePage.context";

export function HomePage() {
  const titlePageContext = useContext(TitlePageContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() =>{
    titlePageContext.setPageTitle('Início');
  },[])

  return (
    <>
    </>
  )
}