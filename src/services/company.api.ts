import { CompaniesList } from "../pages/company/companyList.page";
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

export async function searchCompanies(funcToExc: (data:CompaniesList[])=>void): Promise<void> {   
  await api.get<CompaniesList[]>('company').then((res)=>{
    funcToExc(res.data);
  })
  .catch(error => {
    handleError(error);
  });
}