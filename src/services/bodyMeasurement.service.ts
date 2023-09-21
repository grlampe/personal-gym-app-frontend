import { emitSuccessToast } from '../utils/toast.utils';
import { BodyMeasurementForm } from '../pages/bodyMeasurement/bodyMeasurementEdit.page';
import { BodyMeasurementList } from '../pages/bodyMeasurement/modals/bodyMeasurementModal';
import { UserBodyMeasurementList } from '../pages/bodyMeasurement/bodyMeasurementList.page';
import { api } from "./api.service";

export async function searchUsersBodyMeasurement(funcToExc: (data:UserBodyMeasurementList[])=>void): Promise<void> {   
  await api.get<UserBodyMeasurementList[]>('bodyMeasurement').then((res)=>{
    funcToExc(res.data);
  })
}

export async function searchBodyMeasurementByUserId(id: string, funcToExc: (data:BodyMeasurementList[])=>void): Promise<void> {   
  await api.get<BodyMeasurementList[]>(`bodyMeasurement/userId/${id}`).then((res)=>{
    funcToExc(res.data);
  })
}

export async function searchBodyMeasurementById(id: string) {   
  const result = await api.get<BodyMeasurementForm>(`bodyMeasurement/${id}`)
  return result.data;
}

export async function saveBodyMeasurement(data: BodyMeasurementForm){
  delete data.user
  delete data?.workout
  await api.post('bodyMeasurement', data).then( res => {
    if(res.status){
      emitSuccessToast('Medida adicionada!');
    }
  })
}

export async function updateBodyMeasurement(data: BodyMeasurementForm){
  delete data.user
  delete data?.workout
  await api.put('bodyMeasurement', data).then( res => {
    if(res.status){
      emitSuccessToast('Medida atualizada!');
    }
  })
}

export async function deleteBodyMeasurement(bodyMeasurementId: string){
  api.delete(`bodyMeasurement/${bodyMeasurementId}`).then(res => {
    if(res.status){
      emitSuccessToast('Medida excluída!');
    }
  })
}

export async function getBodyMeasurementReport(data: any) {
  const result = await api.post('reports/bodyMeasurement/xlsx', data, {
    responseType: 'arraybuffer' as 'json'
  })
  
  return result.data
}
