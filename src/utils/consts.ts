import { ToastOptions } from "react-toastify";


//URL Section
const usersUrl = '/user';
const companyUrl = '/company';
const urlForEdit = '/edit/:id';
const urlForNew = '/new';

export const urls = {
  //Company
  companyList: companyUrl,
  companyNew: `${companyUrl}${urlForNew}`,
  companyEdit: `${companyUrl}${urlForEdit}`,

  //User
  userList: usersUrl,
  userNew: `${usersUrl}${urlForNew}`,
  userEdit: `${usersUrl}${urlForEdit}`,
  //Home and Others
  home: '/home',
  login: '/',
  idParam: ':id',
}

//Toast Section
export const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}


export const storageTokenName = '@personal:token';