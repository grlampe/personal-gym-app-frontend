import { useContext, useEffect, useState } from "react";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { VscEdit } from 'react-icons/vsc';
import { FcOk } from 'react-icons/fc';
import { AiFillCloseCircle } from 'react-icons/ai';
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { Screens } from "../../utils/enums";
import { Link } from "react-router-dom";
import { urls } from "../../utils/consts";
import { searchUsers } from "../../services/users.api";

export type UsersList = {
  id: string;
  fullName: string;
  email: string;
  active: boolean;
}

export function UserListPage() {
  const {setPageTitle} = useContext(TitlePageContext);
  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);

  const [users, setUsers] = useState<UsersList[]>([]);

  useEffect(() =>{
    setUsers([]);
    setPageTitle('Usuários');
    setUrlToNew(urls.userNew);
  },[]);

  useEffect(() =>{
    if(searchPressed){
      searchUsers((data: UsersList[]) => {
        setUsers(data);
      });

      setSearchPressed(false);
    }
    
  },[searchPressed]);

  return (
    <>
      <StripedTableComponent>
        <thead className="text-primary">
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ativo</th>
            <th>Ação</th>
          </tr>
        </thead>
        {users.length > 0 ?
          <tbody>
          { users.map(data => {
            return (
              <tr key={data.email}>
                <td>{data.fullName}</td>
                <td>{data.email}</td>
                <td>
                  {data.active? 
                    <FcOk size="24" /> : 
                    <AiFillCloseCircle size="24" style={{color:'#FF3F3F'}}/>}
                </td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <Link to={urls.userEdit.replace(urls.idParam, data.id)}>
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