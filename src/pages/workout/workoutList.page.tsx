import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { ButtonMenuComponent } from "../../components/buttonMenu/buttonMenu.component";

interface WorkoutList {
  id: string;
  description: string;
  active: boolean;
}

export function WorkoutListPage() {
  const {setPageTitle} = useContext(TitlePageContext);
  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [workout, setWorkout] = useState<WorkoutList[]>([]);

  useEffect(() =>{
    setPageTitle('Treino');
    setUrlToNew('/workout/new');
    executeOnPageLoad();
  },[]);

  useEffect(() =>{
    if(searchPressed){
      // searchWorkout((data: WorkoutList[]) => {
      //   setWorkout(data.filter((i) => searchFilter && i.description.toUpperCase().includes(searchFilter.toUpperCase()) || !searchFilter));
      // });

      setSearchPressed(false);
    }
    
  },[searchPressed]);

  const executeOnPageLoad = () => {
    // searchWorkout((data: WorkoutList[]) => {
    //   setWorkout(data);
    // });
  };

  return (
    <>
      <ButtonMenuComponent searchFilter={searchFilter} setSearchFilter={setSearchFilter}/>
    </>
  )
}