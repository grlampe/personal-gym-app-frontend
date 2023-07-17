import { useContext, useEffect, useState } from "react";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { VscEdit } from 'react-icons/vsc';
import { FcOk } from 'react-icons/fc';
import { AiFillCloseCircle } from 'react-icons/ai';
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { Link } from "react-router-dom";
import { searchExercise } from "../../services/exercise.service";
import { ButtonMenuComponent } from "../../components/buttonMenu/buttonMenu.component";

export type ExerciseList = {
  id: string;
  name: string;
  active: boolean;
}

export function ExerciseListPage() {
  const {setPageTitle} = useContext(TitlePageContext);
  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [exercise, setExercise] = useState<ExerciseList[]>([]);

  useEffect(() =>{
    setExercise([]);
    setPageTitle('Exercícios');
    setUrlToNew('/exercise/new');

    executeOnPageLoad();
  },[]);

  useEffect(() =>{
    if(searchPressed){
      searchExercise((data: ExerciseList[]) => {
        setExercise(data.filter((i) => searchFilter && i.name.toUpperCase().includes(searchFilter.toUpperCase()) || !searchFilter));
      });

      setSearchPressed(false);
    }
    
  },[searchPressed]);

  const executeOnPageLoad = () => {
    searchExercise((data: ExerciseList[]) => {
      setExercise(data);
    });
  };

  return (
    <>
      <ButtonMenuComponent searchFilter={searchFilter} setSearchFilter={setSearchFilter}/>
      <StripedTableComponent>
        <thead className="text-primary">
          <tr>
            <th>Nome</th>
            <th>Ativo</th>
            <th>Ação</th>
          </tr>
        </thead>
        {exercise.length > 0 ?
          <tbody>
          { exercise.map(data => {
            return (
              <tr key={data.id}>
                <td>{data.name}</td>
                <td>
                  {data.active? 
                    <FcOk size="24" /> : 
                    <AiFillCloseCircle size="24" style={{color:'#FF3F3F'}}/>}
                </td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <Link to={'exercise/edit/:id'.replace(':id', data.id)}>
                      <button type="button" className="btn btn-outline-info">
                        <VscEdit size="14"/>
                      </button>
                    </Link>
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