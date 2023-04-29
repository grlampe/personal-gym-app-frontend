import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useParams } from "react-router";
import { InputForm } from "../../components/inputForm/inputForm.component";
import { SwitchCheckboxComponent } from "../../components/switchCheckbox/switchCheckbox.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";
import { getUserById, saveUser, updateUser } from "../../services/users.api";
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { emitWarnToast } from "../../utils/toast.utils";
import {
  Formik,
  Form,
} from 'formik';
import { urls } from "../../utils/consts";
type UserEditParams = {
  id: string,
};

export type UserForm = {
  company_id: string,
  fullName: string,
  email: string,
  password: string,
  passwordConfirm?: string,
  active: boolean,
  admin: boolean,
};

export type ErrorUserForm = {
  fullName?: string,
  email?: string,
  password?: string,
  passwordConfirm?: string,
};


export function UserEditPage() {
  const history = useHistory();

  const { setPageTitle } = useContext(TitlePageContext);
  
  const { id } = useParams<UserEditParams>();
  const [initialValues, setInitialValues] = useState<UserForm>({
    company_id: '',
    fullName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    active: true,
    admin: false
  });

  useEffect(() =>{
    setPageTitle(id ? 'Editando Usuário' : 'Cadastrando Usuário');
    setUserData();
  },[]);

  const setUserData = async () => {
    if(id){
      const data = await getUserById(id);
      setInitialValues({...data, password: '', passwordConfirm: ''});
    }
  }

  const usersSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required(),
    fullName: yup
      .string()
      .required(),
    password: yup
      .string(),
    passwordConfirm: yup
      .string(),
  });

  const validateForm = (values: UserForm) => {
    const errors: ErrorUserForm = {};
    if (!values.fullName) {
      errors.fullName = 'Nome do usuário é necessário!';
    } 

    if (!values.email) {
      errors.email = 'O email é necessário!';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Email inválido!';
    }
  
    if (!values.password) {
      errors.password = 'A senha é necessária!';
    } else if (values.password.length < 6 || values.password.length > 8) {
      errors.password = 'A senha deve ter de 6 a 8 digitos!';
    }

    if (!values.passwordConfirm) {
      errors.passwordConfirm = 'Confirme a senha por gentileza.';
    } else if (values.password !== values.passwordConfirm) {
      errors.passwordConfirm = 'As senhas não são identicas!';
    }
  
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validateForm}
      enableReinitialize
      onSubmit={(values, actions) => {
        usersSchema
          .isValid(values)
          .then(valid => {
            if(valid){
              if(id){
                updateUser(values);
              } else {
                saveUser(values);
              }
              history.push(urls.userList);
            } else {
              emitWarnToast('Preencha os dados corretamente!');
            }

            actions.setSubmitting(false);
          })
      }}
    >
      {({isSubmitting, errors, touched})=>(
        <Form>
          <div className="form-row">
            <SwitchCheckboxComponent name="active" description="Ativo" />
            <SwitchCheckboxComponent name="admin" description="Admin" />
          </div>

          <div className="form-row">
            <div className="col-md-6 mb-3">
              <InputForm 
                name="fullName" 
                label="Nome"
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-6 mb-3">
              <InputForm 
                name="email" 
                label="Email"
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-3 mb-3">
              <InputForm 
                type="password" 
                name="password" 
                label="Senha"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-md-3 mb-3">
              <InputForm 
                type="password" 
                name="passwordConfirm" 
                label="Confirmação da Senha"
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <ButtonsFormComponent isSubmitting={isSubmitting}/>
        </Form>
      )} 
    </Formik>
  )
}