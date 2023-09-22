import { UserForm } from "../pages/user/userEdit.page";
import { UsersList } from "../pages/user/userList.page";
import { emitSuccessToast } from "../utils/toast.utils";
import { api } from "./api.service";

export async function searchUsers() {   
  const result = await api.get<UsersList[]>('user')
  return result.data;
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
}

export async function saveUser(data: UserForm){
  delete data.passwordConfirm;
  await api.post('user', data).then( res => {
    if(res.status){
      emitSuccessToast('Usuário adicionado!');
    }
  })
}

export async function deleteUser(userId: string){
  await api.delete(`user/${userId}`).then(res => {
    if(res.status){
      emitSuccessToast('Usuário excluído!');
    }
  })
}

export async function getSimpleUserReport(data: any) {
  const result = await api.post('reports/simpleUser/xlsx', data, {
    responseType: 'arraybuffer' as 'json'
  })
  
  return result.data
}