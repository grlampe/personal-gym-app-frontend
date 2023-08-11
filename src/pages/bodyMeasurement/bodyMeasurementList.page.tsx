import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { VscEdit } from "react-icons/vsc";
import { searchUsersBodyMeasurement } from "../../services/bodyMeasurement.service";
import { BodyMeasurementModalComponent } from "./modals/bodyMeasurementModal";
import { ButtonMenuComponent } from "../../components/buttonMenu/buttonMenu.component";

export type UserBodyMeasurementList = {
  user: {
    id: string;
    name: string;
  }
}

export function BodyMeasurementListPage() {
  const {setPageTitle} = useContext(TitlePageContext);
  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [bodyMeasurement, setBodyMeasurement] = useState<UserBodyMeasurementList[]>([]);

  useEffect(() =>{
    setPageTitle('Medidas Corporais');
    setUrlToNew('/bodyMeasurement/new');

    executeOnPageLoad();
  },[]);

  useEffect(() =>{
    if(searchPressed){
      searchUsersBodyMeasurement((data: UserBodyMeasurementList[]) => {
        setBodyMeasurement(data.filter((i) => searchFilter && i.user.name.toUpperCase().includes(searchFilter.toUpperCase()) || !searchFilter));
      });

      setSearchPressed(false);
    }
    
  },[searchPressed]);

  const executeOnPageLoad = () => {
    searchUsersBodyMeasurement((data: UserBodyMeasurementList[]) => {
      setBodyMeasurement(data);
    });
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const openModal = (userId: string) => () => {
    setUserId(userId);
    handleShow();
  }

  return (
    <>
      <ButtonMenuComponent searchFilter={searchFilter} setSearchFilter={setSearchFilter}/>
      <BodyMeasurementModalComponent show={show} userId={userId} handleClose={handleClose}/>
      <StripedTableComponent>
        <thead className="text-primary">
          <tr>
            <th>Nome</th>
            <th>Ação</th>
          </tr>
        </thead>
        {bodyMeasurement.length > 0 ?
          <tbody>
          {bodyMeasurement.map(data => {
            return (
              <tr key={data.user.id}>
                <td>{data.user.name}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                      <button type="button" className="btn btn-outline-info" onClick={openModal(data.user.id)}>
                        <VscEdit size="14"/>
                      </button>
                  </div>  
                </td>
              </tr>
            )
          })}
        </tbody> : <tbody><tr><td>Nenhum dado encontrado...</td></tr></tbody>
        }     
      </StripedTableComponent>
    </>
  )
}
