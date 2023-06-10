import { DateUtils } from './../utils/date';
import { ReceivingBillsForm } from './../pages/receivingBills/receivingBillsEdit.page';
import { ReceivingBillsList } from './../pages/receivingBills/receivingBillsList.page';
import { emitErrorToast, emitSuccessToast } from "../utils/toast.utils";
import { api } from "./api";

export function handleError(error: any){
  if(error.response.data.message){
    emitErrorToast(error.response.data.message);
  } else {
    emitErrorToast(error.message);
  }
}

export async function saveReceivingBills(data: ReceivingBillsForm) {
  if (!data.paidAt) {
    delete data.paidAt;
  } else {
    data.paidAt = DateUtils.formatUTCDateToBackend(data.paidAt)
  }

  delete data.user

  await api.post('receivingBills', data).then( res => {
    if(res.status){
      emitSuccessToast('Recebimento adicionado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function updateReceivingBills(data: ReceivingBillsForm) { 
  if (!data.paidAt) {
    delete data.paidAt;
  } else {
    data.paidAt = DateUtils.formatUTCDateToBackend(data.paidAt)
  }
  
  delete data.user
  
  await api.put('receivingBills', data).then( res => {
    if(res.status){
      emitSuccessToast('Recebimento atualizado!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function deleteReceivingBillsById(id: string) {
  await api.delete(`receivingBills/${id}`).then( res => {
    if(res.status){
      emitSuccessToast('Recebimento excluído!');
    }
  })
  .catch(error => {
    handleError(error);
  });
}

export async function searchReceivingBills(funcToExc: (data:ReceivingBillsList[])=>void): Promise<void> {   
  await api.get<ReceivingBillsList[]>('receivingBills').then((res)=>{
    funcToExc(res.data);
  })
  .catch(error => {
    handleError(error);
  });
}

export async function searchReceivingBillsByUserId(id: string) {   
  const result = await api.get<ReceivingBillsList[]>(`receivingBills/${id}`);
  return result.data;
}

export async function searchReceivingBillsById(id: string) {
  const result = await api.get<ReceivingBillsForm>(`receivingBills/${id}`);
  return result.data;
}