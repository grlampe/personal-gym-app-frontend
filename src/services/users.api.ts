import { User } from "../contexts/auth.context";
import { UserForm } from "../pages/user/userEdit.page";
import { UsersList } from "../pages/user/userList.page";
import { storageCurrentUser } from "../utils/consts";
import { emitErrorToast, emitSuccessToast } from "../utils/toast.utils";
import { api } from "./api";


function handleError(error: any){
  console.error(error);
  if(error.response.data.message){
    emitErrorToast(error.response.data.message);
  } else {
    emitErrorToast(error.message);
  }
}

export async function searchUsers(funcToExc: (data:UsersList[])=>void): Promise<void> {   
  await api.get<UsersList[]>('users').then((res)=>{
    funcToExc(res.data);
  })
  .catch(error => {
    handleError(error);
  });
}

export async function getUserById(id: string) {
  const result = await api.get<UserForm>(`users/${id}`);
  return result.data;
}

export async function updateUser(data: UserForm){
  delete data.passwordConfirm;  
  await api.put('users', data).then( res => {
    if(res.status){
      emitSuccessToast('Usuário atualizado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function saveUser(data: UserForm){
  delete data.passwordConfirm;
  await api.post('users', data).then( res => {
    if(res.status){
      emitSuccessToast('Usuário adicionado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}