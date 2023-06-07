import { useContext, useEffect } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";


export function BodyMeasurementListPage() {
  const {setPageTitle} = useContext(TitlePageContext);
  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);

  useEffect(() =>{
    setPageTitle('Medidas Corporais');
    setUrlToNew('/bodyMeasurement/new');
  },[]);

  return (
    <>
    </>
  )
}