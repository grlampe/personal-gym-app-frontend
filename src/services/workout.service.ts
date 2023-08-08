import { WorkoutList } from "../pages/workout/modals/workoutList/workoutListModal";
import { WorkoutForm, WorkoutOnCategory } from "../pages/workout/workoutEdit.page";
import { WorkoutUsersList } from "../pages/workout/workoutList.page";
import { emitErrorToast, emitSuccessToast } from "../utils/toast.utils";
import { api } from "./api.service";

export function handleError(error: any){
  console.error(error);
  if(error.response.data.message){
    emitErrorToast(error.response.data.message);
  } else {
    emitErrorToast(error.message);
  }
}

export async function searchUsersWorkout(funcToExc: (data: WorkoutUsersList[]) => void): Promise<void> {   
  await api.get<WorkoutUsersList[]>('workout/user').then((res)=>{
    funcToExc(res.data);
  })
  .catch(error => {
    handleError(error);
  });
}

export async function searchWorkoutById(id: string) {   
  const result = await api.get<WorkoutForm>(`workout/${id}`)
  return result.data;
}

export async function searchWorkoutByUserId(id: string, funcToExc: (data: WorkoutList[])=>void): Promise<void> {   
  await api.get<WorkoutList[]>(`workout/user/${id}`).then((res)=>{
    funcToExc(res.data);
  })
  .catch(error => {
    handleError(error);
  });
}


export async function updateWorkout(data: WorkoutForm){
  delete data.user;  
  await api.put('workout', data).then( res => {
    if(res.status){
      emitSuccessToast('Treino atualizado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function saveWorkout(data: WorkoutForm){
  delete data.user;  
  await api.post('workout', data).then( res => {
    if(res.status){
      emitSuccessToast('Treino adicionado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function searchWorkoutOnCategoryByWorkoutId(id: string) {   
  const result = await api.get<WorkoutOnCategory[]>(`workoutOnCategory/workout/${id}`)
  return result.data;
}

export async function saveWorkoutOnCategory(data: any){
  await api.post('workoutOnCategory', data).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Treino adicionada!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function deleteWorkoutOnCategory(id: string) {
  await api.delete(`workoutOnCategory/${id}`).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Treino desnviculada!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}