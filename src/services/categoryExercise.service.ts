import { CategoryExerciseForm } from "../pages/categoryExercise/categoryExerciseEdit.page";
import { CategoryExerciseList } from "../pages/categoryExercise/categoryExerciseList.page";
import { emitSuccessToast } from "../utils/toast.utils";
import { api } from "./api.service";

export async function searchCategoryExercise(funcToExc: (data:CategoryExerciseList[])=>void): Promise<void> {   
  await api.get<CategoryExerciseList[]>('categoryExercise').then((res)=>{
    funcToExc(res.data);
  })
}

export async function getCategoryExerciseById(id: string) {
  const result = await api.get<CategoryExerciseForm>(`categoryExercise/${id}`);
  return result.data;
}

export async function updateCategoryExercise(data: CategoryExerciseForm){ 
  await api.put('categoryExercise', data).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício atualizada!');
    }
  })
}

export async function saveCategoryExercise(data: CategoryExerciseForm){
  await api.post('categoryExercise', data).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício  adicionada!');
    }
  })
}

export async function deleteCategoryExercise(categoryExerciseId: string){
  await api.delete(`categoryExercise/${categoryExerciseId}`).then(res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício excluído!');
    }
  })
}