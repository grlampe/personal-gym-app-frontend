import { WorkoutForm } from "../pages/workout/workoutEdit.page";
import { WorkoutUsersList } from "../pages/workout/workoutList.page";
import { emitErrorToast, emitSuccessToast } from "../utils/toast.utils";
import { api } from "./api.service";

function handleError(error: any){
  console.error(error);
  if(error.response.data.message){
    emitErrorToast(error.response.data.message);
  } else {
    emitErrorToast(error.message);
  }
}

export async function searchUsersWorkout(funcToExc: (data:WorkoutUsersList[]) => void): Promise<void> {   
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

