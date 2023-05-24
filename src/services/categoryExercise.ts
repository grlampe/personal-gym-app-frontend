import { CategoryExerciseForm } from "../pages/categoryExercise/categoryExerciseEdit.page";
import { CategoryExerciseList } from "../pages/categoryExercise/categoryExerciseList.page";
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

export async function searchCategoryExercise(funcToExc: (data:CategoryExerciseList[])=>void): Promise<void> {   
  await api.get<CategoryExerciseList[]>('categoryExercise').then((res)=>{
    funcToExc(res.data);
  })
  .catch(error => {
    handleError(error);
  });
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
  .catch(error => {
    handleError(error);
  });
}

export async function saveCategoryExercise(data: CategoryExerciseForm){
  await api.post('categoryExercise', data).then( res => {
    if(res.status){
      emitSuccessToast('Categoria de Exercício  adicionada!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}