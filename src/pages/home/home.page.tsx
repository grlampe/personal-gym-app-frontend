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
      <div className="d-flex flex-column bd-highlight text-right" style={{padding: '0px 30px', height: '40px'}}>
        <p className="p-1 bd-highlight text-primary"style={{margin: '0 !important', padding: '5px 2px !important', height: '12px'}}>
          <strong>{currentUser?.id}</strong>
        </p>
        <strong>{currentUser?.id}</strong>
        <p className="p-1 bd-highlight text-primary"style={{margin: '0 !important', padding: '5px 2px !important', height: '12px'}}>
          <strong>{currentUser?.name}</strong>
        </p>
      </div>
    </>
  )
}