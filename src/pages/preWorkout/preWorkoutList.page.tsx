import { useContext, useEffect, useState } from "react";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { VscEdit, VscTrash } from 'react-icons/vsc';
import { FcOk } from 'react-icons/fc';
import { AiFillCloseCircle } from 'react-icons/ai';
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { Link } from "react-router-dom";
import { deletePreWorkout, searchPreWorkout } from "../../services/preWorkout.service";
import { ButtonMenuComponent } from "../../components/buttonMenu/buttonMenu.component";

export type PreWorkoutList = {
  id: string;
  description: string;
  active: boolean;
}

export function PreWorkoutListPage() {
  const {setPageTitle} = useContext(TitlePageContext);
  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [preWorkout, setPreWorkout] = useState<PreWorkoutList[]>([]);

  useEffect(() =>{
    setPreWorkout([]);
    setPageTitle('Pré-Treino');
    setUrlToNew('/preWorkout/new');
    executeOnPageLoad();
  },[]);

  useEffect(() =>{
    if(searchPressed){
      searchPreWorkout((data: PreWorkoutList[]) => {
        setPreWorkout(data.filter((i) => searchFilter && i.description.toUpperCase().includes(searchFilter.toUpperCase()) || !searchFilter));
      });

      setSearchPressed(false);
    }
    
  },[searchPressed]);

  const executeOnPageLoad = () => {
    searchPreWorkout((data: PreWorkoutList[]) => {
      setPreWorkout(data);
    });
  };

  const handleDelete = (id: string) => {
    deletePreWorkout(id).then(() => {
      executeOnPageLoad();   
    })
  }

  return (
    <>
      <ButtonMenuComponent searchFilter={searchFilter} setSearchFilter={setSearchFilter}/>
      <StripedTableComponent>
        <thead className="text-primary">
          <tr>
            <th>Descrição</th>
            <th>Ativo</th>
            <th>Ação</th>
          </tr>
        </thead>
        {preWorkout.length > 0 ?
          <tbody>
          { preWorkout.map(data => {
            return (
              <tr key={data.id}>
                <td>{data.description}</td>
                <td>
                  {data.active? 
                    <FcOk size="24" /> : 
                    <AiFillCloseCircle size="24" style={{color:'#FF3F3F'}}/>}
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <Link to={'preWorkout/edit/:id'.replace(':id', data.id)}>
                      <button type="button" className="btn btn-outline-info">
                        <VscEdit size="14"/>
                      </button>
                    </Link>
                    <button type="button" className="btn btn-outline-danger ml-1" onClick={() => handleDelete(data.id)}>
                      <VscTrash size="14"/>
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