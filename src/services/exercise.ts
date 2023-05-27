import { ExerciseForm, ExerciseOnCategoryExerciseList } from "../pages/exercise/exerciseEdit.page";
import { ExerciseList } from "../pages/exercise/exerciseList.page";
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

export async function searchExercise(funcToExc: (data:ExerciseList[])=>void): Promise<void> {   
  await api.get<ExerciseList[]>('exercise').then((res)=>{
    funcToExc(res.data);
  })
  .catch(error => {
    handleError(error);
  });
}

export async function getExerciseById(id: string) {
  const result = await api.get<ExerciseForm>(`exercise/${id}`);
  return result.data;
}

export async function getExerciseOnCategoryExerciseByExerciseId(id: string) {
  const result = await api.get<ExerciseOnCategoryExerciseList[]>(`exerciseOnCategoryExercise/exercideId/${id}`);
  return result.data;
}

export async function deleteExerciseOnCategoryExerciseById(id: string) {
  await api.delete(`exerciseOnCategoryExercise/${id}`).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício desnviculada!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function updateExercise(data: ExerciseForm){ 
  await api.put('exercise', data).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício atualizada!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function saveExercise(data: ExerciseForm){
  await api.post('exercise', data).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício  adicionada!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}