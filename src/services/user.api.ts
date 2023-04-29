import { UserForm } from "../pages/user/userEdit.page";
import { UsersList } from "../pages/user/userList.page";
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
  await api.get<UsersList[]>('user').then((res)=>{
    funcToExc(res.data);
  })
  .catch(error => {
    handleError(error);
  });
}

export async function getUserById(id: string) {
  const result = await api.get<UserForm>(`user/${id}`);
  return result.data;
}

export async function updateUser(data: UserForm){
  delete data.passwordConfirm;  
  await api.put('user', data).then( res => {
    if(res.status){
      emitSuccessToast('Usuário atualizado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function saveUser(data: UserForm){
  console.log('aqui');
  delete data.passwordConfirm;
  await api.post('user', data).then( res => {
    if(res.status){
      emitSuccessToast('Usuário adicionado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}