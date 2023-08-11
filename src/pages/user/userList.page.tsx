import { useContext, useEffect, useState } from "react";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { VscEdit, VscTrash } from 'react-icons/vsc';
import { FcOk } from 'react-icons/fc';
import { AiFillCloseCircle } from 'react-icons/ai';
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { Link } from "react-router-dom";
import { deleteUser, searchUsers } from "../../services/user.service";
import { ButtonMenuComponent } from "../../components/buttonMenu/buttonMenu.component";

export type UsersList = {
  id: string;
  name: string;
  email: string;
  active: boolean;
}

export function UserListPage() {
  const {setPageTitle} = useContext(TitlePageContext);
  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [users, setUsers] = useState<UsersList[]>([]);

  useEffect(() =>{
    setUsers([]);
    setPageTitle('Usuários');
    setUrlToNew('/user/new');

    executeOnPageLoad();
  },[]);

  useEffect(() => {
    if(searchPressed){
      searchUsers().then((data: UsersList[]) => {
        setUsers(data.filter((i) => searchFilter && (i.name.toUpperCase().includes(searchFilter.toUpperCase()) || i.email.toUpperCase().includes(searchFilter.toUpperCase())) || !searchFilter));
      })
     
      setSearchPressed(false);
    }
    
  },[searchPressed]);

  const executeOnPageLoad = () => {
    searchUsers().then((data: UsersList[]) => {
      setUsers(data);
    });
  };

  const handleDelete = (id: string) => {
    deleteUser(id).then(() => {
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
                <td>{data.name}</td>
                <td>{data.email}</td>
                <td>
                  {data.active? 
                    <FcOk size="24" /> : 
                    <AiFillCloseCircle size="24" style={{color:'#FF3F3F'}}/>}
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <Link to={'user/edit/:id'.replace(':id', data.id)}>
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