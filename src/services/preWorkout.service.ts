import { PreWorkoutForm, PreWorkoutOnExerciseList } from "../pages/preWorkout/preWorkoutEdit.page";
import { PreWorkoutList } from "../pages/preWorkout/preWorkoutList.page";
import { emitErrorToast, emitSuccessToast } from "../utils/toast.utils";
import { api } from "./api.service";

export function handleError(error: any){
  if(error.response.data.message){
    emitErrorToast(error.response.data.message);
  } else {
    emitErrorToast(error.message);
  }
}

export async function searchPreWorkout(funcToExc: (data: PreWorkoutList[])=>void): Promise<void> {   
  await api.get<PreWorkoutList[]>('preWorkout').then((res)=>{
    funcToExc(res.data);
  })
  .catch(error => {
    handleError(error);
  });
}

export async function getPreWorkoutById(id: string) {
  const result = await api.get<PreWorkoutForm>(`preWorkout/${id}`);
  return result.data;
}

export async function updatePreWorkout(data: PreWorkoutForm){ 
  await api.put('preWorkout', data).then( res => {
    if(res.status){
      emitSuccessToast('Pré-treino atualizado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function updatePreWorkoutOnExercise(data: PreWorkoutOnExerciseList[]){ 
  data.forEach((item) => {
    delete item.exercise;
  });
  
  await api.put('preWorkoutOnExercise', data).catch(error => {
    handleError(error);
  });
}

export async function savePreWorkout(data: PreWorkoutForm){
  await api.post('preWorkout', data).then( res => {
    if(res.status){
      emitSuccessToast('Pré-treino  adicionado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function savePreWorkoutOnExercise(data: PreWorkoutOnExerciseList) {
  await api.post('preWorkoutOnExercise', data).catch(error => {
    handleError(error);
  });
}

export async function getPreWorkoutOnExerciseByPreWorkoutId(preWorkoutId: string) {
  const result = await api.get<PreWorkoutOnExerciseList[]>(`preWorkoutOnExercise/preWorkoutId/${preWorkoutId}`);
  return result.data;
}

export async function deletePreWorkoutOnExerciseById(id: string) {
  await api.delete(`preWorkoutOnExercise/${id}`).then( res => {
    if(res.status){
      emitSuccessToast('Exercício desnviculado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}