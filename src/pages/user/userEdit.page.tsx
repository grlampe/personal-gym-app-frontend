import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useParams } from "react-router";
import { InputForm } from "../../components/inputForm/inputForm.component";
import { SwitchCheckboxComponent } from "../../components/switchCheckbox/switchCheckbox.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";
import { getUserById, saveUser, updateUser } from "../../services/user.api";
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { emitWarnToast } from "../../utils/toast.utils";
import {
  Formik,
  Form,
  Field,
} from 'formik';
import { DateUtils } from "../../utils/date";
import styles from '../../components/inputForm/inputFormStyle.module.scss';

type UserEditParams = {
  id: string,
};

export type UserForm = {
  name: string,
  email: string,
  password: string,
  passwordConfirm?: string,
  cpf: string,
  birthDate: string,
  addressStreet: string,
  addressNumber: string,
  addressZipCode: string,
  addressDistrict: string,
  addressCity: string,
  addressState: string,
  addressComplement: string,
  active: boolean,
};

export type ErrorUserForm = {
  name?: string,
  email?: string,
  password?: string,
  passwordConfirm?: string,
  cpf?: string,
  birthDate?: string,
  addressStreet?: string,
  addressNumber?: string,
  addressZipCode?: string,
  addressDistrict?: string,
  addressCity?: string,
  addressState?: string,
};


export function UserEditPage() {
  const history = useHistory();

  const { setPageTitle } = useContext(TitlePageContext);
  
  const { id } = useParams<UserEditParams>();

  const [initialValues, setInitialValues] = useState<UserForm>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    cpf: '',
    birthDate: '',
    addressZipCode: '',
    addressStreet: '',
    addressNumber: '',
    addressDistrict: '',
    addressCity: '',
    addressState: '',
    addressComplement: '',
    active: true,
  });

  useEffect(() =>{
    setPageTitle(id ? 'Editando Usuário' : 'Cadastrando Usuário');
    setUserData();
  },[]);

  const setUserData = async () => {
    if (id) {
      const data = await getUserById(id);
      data.birthDate = DateUtils.formatUTCDateToBackend(data.birthDate)
      setInitialValues({...data, password: '', passwordConfirm: ''});
    }
  }

  const usersSchema = yup.object().shape({
    name: yup
      .string()
      .required(), 
    email: yup
      .string()
      .required(),  
    password: yup
      .string(),
    passwordConfirm: yup
      .string(), 
    cpf: yup
      .string()
      .required(),  
    birthDate: yup
      .string()
      .required(),  
    addressStreet: yup
      .string()
      .required(),  
    addressNumber: yup
      .string()
      .required(), 
    addressZipCode: yup
      .string()
      .required(),  
    addressDistrict: yup
      .string()
      .required(),  
    addressCity: yup
      .string()
      .required(),  
    addressState: yup
      .string()
      .required(),  
    addressComplement: yup
      .string(), 
  });

  const validateForm = (values: UserForm) => {
    const errors: ErrorUserForm = {};
    if (!values.name) {
      errors.name = 'Nome do usuário é necessário!';
    } 

    if (!values.email) {
      errors.email = 'O email é necessário!';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Email inválido!';
    }
    
    if (!id) {
      if (!values.password) {
        errors.password = 'A senha é necessária!';
      } 
    }

    if ((values.password) && (values.password.length < 6 || values.password.length > 8)) {
      errors.password = 'A senha deve ter de 6 a 8 digitos!';
    }
    

    if ((values.password) && (!values.passwordConfirm)) {
      errors.passwordConfirm = 'Confirme a senha por gentileza.';
    } else if (values.password !== values.passwordConfirm) {
      errors.passwordConfirm = 'As senhas não são identicas!';
    }

    if (!values.birthDate) {
      errors.birthDate = 'Data Nascimento é necessária!';
    } 

    if (!values.cpf) {
      errors.cpf = 'CPF é necessário!';
    } 

    if (!values.addressZipCode) {
      errors.addressZipCode = 'CEP é necessário!';
    } 

    if (!values.addressStreet) {
      errors.addressStreet = 'Logradouro é necessário!';
    } 

    if (!values.addressNumber) {
      errors.addressNumber = 'Número é necessário!';
    } 

    if (!values.addressDistrict) {
      errors.addressDistrict = 'Bairro é necessário!';
    } 

    if (!values.addressCity) {
      errors.addressCity = 'Cidade é necessária!';
    } 

    if (!values.addressState) {
      errors.addressState = 'Bairro é necessário!';
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
              history.push('/user');
            } else {
              emitWarnToast('Preencha os dados corretamente!');
            }

            actions.setSubmitting(true);
          })
      }}
    >
      {({isSubmitting, errors, touched})=>(
        <Form>
          <div className="form-row">
            <SwitchCheckboxComponent name="active" description="Ativo" />
          </div>

          <div className="form-row">
            <div className="col-md-6 mb-3">
              <InputForm 
                name="name" 
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
          <div className="form-row">
            <div className="col-md-3 mb-3">
              <InputForm
                type="date"
                name="birthDate" 
                label="Data Nascimento"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label>CPF</label>
              <Field 
                className={`form-control form-control-sm ${errors["cpf"] && touched["cpf"] ? styles.errorField : ''}`}
                name="cpf"
                maxLength={11}
              />
              <div className={styles.error}>{errors["cpf"]}</div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-2 mb-3">
            <label>CEP</label>
              <Field 
                className={`form-control form-control-sm ${errors["addressZipCode"] && touched["addressZipCode"] ? styles.errorField : ''}`}
                name="addressZipCode"
                maxLength={8}
              />
              <div className={styles.error}>{errors["addressZipCode"]}</div>
            </div>
            <div className="col-md-4 mb-3">
              <InputForm 
                name="addressStreet" 
                label="Logradouro"
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="form-row">
              <div className="col-md-1 mb-3">
                <InputForm 
                  name="addressNumber" 
                  label="Número"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-md-3 mb-3">
                <InputForm 
                  name="addressDistrict" 
                  label="Bairro"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="col-md-2 mb-3">
                <InputForm 
                  name="addressCity" 
                  label="Cidade"
                  errors={errors}
                  touched={touched}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-2 mb-3">
                <InputForm 
                  name="addressState" 
                  label="Estado"
                  errors={errors}
                  touched={touched}
                />
              </div>  
              <div className="col-md-4 mb-3">
                <InputForm 
                  name="complement" 
                  label="Complemento"
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