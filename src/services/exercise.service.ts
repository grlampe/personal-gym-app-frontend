import { ExerciseForm, ExerciseOnCategoryExerciseList } from "../pages/exercise/exerciseEdit.page";
import { ExerciseList } from "../pages/exercise/exerciseList.page";
import { emitSuccessToast } from "../utils/toast.utils";
import { api } from "./api.service";

export async function searchExercise(funcToExc: (data:ExerciseList[])=>void): Promise<void> {   
  await api.get<ExerciseList[]>('exercise').then((res)=>{
    funcToExc(res.data);
  })
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
  await api.delete(`exerciseOnCategoryExercise/exercideId/${id}`).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício desnviculada!');
    }
  })
}

export async function saveExerciseOnCategoryExercise(data: any){
  await api.post('exerciseOnCategoryExercise', data)
}

export async function updateExercise(data: ExerciseForm){ 
  await api.put('exercise', data).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício atualizada!');
    }
  })
}

export async function saveExercise(data: ExerciseForm){
  await api.post('exercise', data).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício  adicionada!');
    }
  })
}

export async function deleteExercise(exerciseId: string){
  await api.delete(`exercise/${exerciseId}`).then(res => {
    if(res.status){
      emitSuccessToast('Exercício excluído!');
    }
  })
}