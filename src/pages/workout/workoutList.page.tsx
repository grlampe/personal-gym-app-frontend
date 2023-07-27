import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { ButtonMenuComponent } from "../../components/buttonMenu/buttonMenu.component";
import { UsersList } from "../user/userList.page";
import { searchUsersWorkout } from "../../services/workout.service";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { VscEdit } from "react-icons/vsc";
import { WorkoutListModal } from "./modals/workoutListModal";

export interface WorkoutUsersList {
  user: UsersList;
}

export function WorkoutListPage() {
  const {setPageTitle} = useContext(TitlePageContext);
  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [workoutUsers, setWorkoutUsers] = useState<WorkoutUsersList[]>([]);
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() =>{
    setPageTitle('Treino');
    setUrlToNew('/workout/new');
    executeOnPageLoad();
  },[]);

  useEffect(() =>{
    if(searchPressed){
      searchUsersWorkout((data: WorkoutUsersList[]) => {
        setWorkoutUsers(data.filter((i) => searchFilter && i.user.name.toUpperCase().includes(searchFilter.toUpperCase()) || !searchFilter));
      });

      setSearchPressed(false);
    }
    
  },[searchPressed]);

  const executeOnPageLoad = () => {
    searchUsersWorkout((data: WorkoutUsersList[]) => {
      setWorkoutUsers(data);
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
      <WorkoutListModal show={show} userId={userId} handleClose={handleClose} />
      
      <StripedTableComponent>
        <thead className="text-primary">
          <tr>
            <th>Nome</th>
            <th>Ação</th>
          </tr>
        </thead>
        {workoutUsers.length > 0 ?
          <tbody>
          {workoutUsers.map(data => {
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