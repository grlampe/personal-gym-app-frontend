import { useCallback, useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useParams } from "react-router";
import { InputForm } from "../../components/inputForm/inputForm.component";
import { SwitchCheckboxComponent } from "../../components/switchCheckbox/switchCheckbox.component";
import { getUserById, saveUser, updateUser } from "../../services/user.service";
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import {
  Formik,
  Form,
  Field
} from 'formik';
import { DateUtils } from "../../utils/date";
import styles from '../../components/inputForm/inputFormStyle.module.scss';
import InputMask from 'react-input-mask';
import { states } from "../../utils/consts";
import { fetchAddressByCEP } from "../../utils/buscaCep";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";

type UserEditParams = { id: string };

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

const userValidationSchema = Yup.object().shape({
  name: Yup.string().required('Nome do usuário é necessário!'),
  email: Yup.string().email('Email inválido!').required('O email é necessário!'),
  password: Yup.string().when('id', {
    is: (id: string) => !id,
    then: Yup.string()
      .required('A senha é necessária!')
      .min(6, 'A senha deve ter pelo menos 6 caracteres!')
      .matches(/(?=.*[A-Z])/, 'A senha deve ter pelo menos uma letra maiúscula.')
      .matches(/(?=.*[!@#$%^&*.])/, 'A senha deve ter pelo menos um caractere especial.')
      .matches(/(?=.*[0-9])/, 'A senha deve ter pelo menos um número.'),
    otherwise: Yup.string(),
  }),
  passwordConfirm: Yup.string().when('password', {
    is: (password: string) => !!password,
    then: Yup.string()
      .required('Confirme a senha por gentileza.')
      .oneOf([Yup.ref('password'), null], 'As senhas não são idênticas!'),
    otherwise: Yup.string(),
  }),
  cpf: Yup.string()
    .required('CPF é necessário!')
    .min(14, 'CPF Inválido!')
    .max(14, 'CPF Inválido!'),
  birthDate: Yup.string().required('Data Nascimento é necessária!'),
  addressZipCode: Yup.string()
    .required('CEP é necessário!')
    .min(10, 'CEP Inválido!')
    .max(10, 'CEP Inválido!'),
  addressStreet: Yup.string().required('Logradouro é necessário!'),
  addressNumber: Yup.string().required('Número é necessário!'),
  addressDistrict: Yup.string().required('Bairro é necessário!'),
  addressCity: Yup.string().required('Cidade é necessária!'),
  addressState: Yup.string().required('Estado é necessária!'),
});



export function UserEditPage() {
  const { setPageTitle } = useContext(TitlePageContext);
  const history = useHistory();
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

    const setUserData = useCallback(async () => {
      if (id) {
          const data = await getUserById(id);
          data.birthDate = DateUtils.formatDateToBackend(data.birthDate);
          setInitialValues({ ...data, password: '', passwordConfirm: '' });
      }
  }, [id]);

  useEffect(() => {
      setPageTitle(id ? 'Editando Usuário' : 'Cadastrando Usuário');
      setUserData();
  }, [setUserData, id, setPageTitle]);

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (id) {
        await updateUser(values);
      } else {
        await saveUser(values);
      }
      setSubmitting(true);

      history.push('/user');
    } catch (error) {
      setInitialValues({ ...values, passwordConfirm: '' });
    }
  }; 

  return (
    <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={userValidationSchema}
        onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, setFieldValue, values }) => (
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
              <Field name="cpf">
                {({ field, meta, form }: any) => (
                  <>
                    <InputMask 
                      {...field}
                      className={`form-control form-control-sm ${meta.touched && meta.error ? styles.errorField : ''}`}
                      mask="999.999.999-99"
                      maskChar=""
                      onChange={e => {
                        form.setFieldValue("cpf", e.target.value);
                      }}
                      onBlur={() => form.setFieldTouched('cpf', true)}
                    />
                    {meta.touched && meta.error && <div className={styles.error}>{meta.error}</div>}
                  </>
                )}
              </Field>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-2 mb-3">
              <label>CEP</label>
              <InputMask 
                className={`form-control form-control-sm ${errors.addressZipCode && touched.addressZipCode ? styles.errorField : ''}`}
                name="addressZipCode"
                value={values.addressZipCode}
                mask="99.999-999"
                maskChar=""
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("addressZipCode", value);
                }}
                onBlur={async (e) => {
                  const cep = e.target.value.replace(/[^0-9]/g, '');
                  if (cep.length === 8) {
                    const addressData = await fetchAddressByCEP(cep);
                    if (addressData) {
                      for (let key in addressData) {
                        setFieldValue(key, addressData[key]);
                      }
                    }
                  }
                }}
              />
              {touched.addressZipCode && errors.addressZipCode && (
                <div className={styles.error}>{errors.addressZipCode}</div>
              )}
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
                <label>Estado</label>
                <Field name="addressState" as="select" className={`form-control form-control-sm ${errors.addressState && touched.addressState ? styles.errorField : ''}`}>
                  <option value="" label="Selecione um estado" />
                  {states.map(state => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </Field>
                {touched.addressState && errors.addressState && (
                  <div className={styles.error}>{errors.addressState}</div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <InputForm 
                  name="addressComplement" 
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