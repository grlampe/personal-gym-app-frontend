import { useContext, useEffect, useState } from "react";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { VscEdit, VscTrash } from 'react-icons/vsc';
import { FcOk } from 'react-icons/fc';
import { AiFillCloseCircle } from 'react-icons/ai';
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { Link } from "react-router-dom";
import { deleteCategoryExercise, searchCategoryExercise } from "../../services/categoryExercise.service";
import { ButtonMenuComponent } from "../../components/buttonMenu/buttonMenu.component";

export type CategoryExerciseList = {
  id: string;
  name: string;
  active: boolean;
}

export function CategoryExerciseListPage() {
  const {setPageTitle} = useContext(TitlePageContext);
  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [categoryExercise, setCategoryExercise] = useState<CategoryExerciseList[]>([]);

  useEffect(() =>{
    setCategoryExercise([]);
    setPageTitle('Categoria de Exercícios');
    setUrlToNew('/categoryExercise/new');

    executeOnPageLoad();
  },[]);

  useEffect(() =>{
    if(searchPressed){
      searchCategoryExercise((data: CategoryExerciseList[]) => {
        setCategoryExercise(data.filter((i) => searchFilter && i.name.toUpperCase().includes(searchFilter.toUpperCase()) || !searchFilter));
      });

      setSearchPressed(false);
    }
    
  },[searchPressed]);

  const executeOnPageLoad = () => {
    searchCategoryExercise((data: CategoryExerciseList[]) => {
      setCategoryExercise(data);
    });
  };

  const handleDelete = (id: string) => {
    deleteCategoryExercise(id).then(() => {
      executeOnPageLoad();   
    })
  }

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
        {categoryExercise.length > 0 ?
          <tbody>
          { categoryExercise.map(data => {
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
                    <Link to={'categoryExercise/edit/:id'.replace(':id', data.id)}>
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