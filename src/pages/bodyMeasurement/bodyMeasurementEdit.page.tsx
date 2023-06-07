import { useContext, useEffect } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useParams } from "react-router-dom";

type BodyMeasurementEditParams = {
  id: string,
};

export function BodyMeasurementEditPage() {
  const { setPageTitle } = useContext(TitlePageContext);

  const { id } = useParams<BodyMeasurementEditParams>();
  
  useEffect(() =>{
    setPageTitle(id ? 'Editando Medidas Corporais' : 'Cadastrando Medidas Corporais');
  },[]);

  return (
    <>
    </>
  )
}