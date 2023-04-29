import './signInStyle.css';
import logo from '../../../assets/img/app-logo.png';
import { RiLoginCircleLine } from 'react-icons/ri';
import { Formik, Form, Field } from 'formik';
import { useContext, useState } from 'react';
import * as yup from 'yup';
import { emitWarnToast } from '../../utils/toast.utils';
import styles from './signInStyle.module.scss';
import { AuthContext } from '../../contexts/auth.context';
import { withRouter, useHistory } from 'react-router-dom';
import { urls } from '../../utils/consts';


export type LoginForm = {
  email?: string;
  password?: string;
}

function SignInPage() {
  const { signIn } = useContext(AuthContext);
  const history = useHistory();

  const [initialValues, setInitialValues] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const validateForm = (values: LoginForm) => {
    const errors: LoginForm = {};
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

    return errors;
  };

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email()
      .required(),
    password: yup
      .string()
      .required(),
  });

  return (
    <>
      <div className="limiter" id="login">
          <div 
            className="container-login100" 
            style={{
              backgroundImage:'url(/assets/img/background-app.png)',
              backgroundSize: '100%',
            }}
          >
            <div className="container">
                <div className="row">
                    <div className="col-md-5 col-md-offset-1">
                    <div className="wrap-login100">
                          <Formik
                            initialValues={initialValues}
                            validate={validateForm}
                            enableReinitialize
                            onSubmit={(values, actions) => {
                              loginSchema
                                .isValid(values)
                                .then(async valid => {
                                  if(valid){
                                    await signIn(values);

                                    history.push(urls.home);
                                  } else {
                                    emitWarnToast('Preencha os dados corretamente!');
                                  }

                                  actions.setSubmitting(false);
                                })
                            }}
                          >
                            {({isSubmitting, errors, touched})=>(
                              <Form className="login100-form validate-form"> 
                                <span className="login100-form-title "> 
                                  <img src={logo} alt="PERSONAL GYM APP" style={{paddingBottom: '20px'}}/> 
                                </span> 
                                <span className="login100-form-subtitle m-b-16"> Entre com seus dados </span>
                                    <div className="wrap-input100 validate-input m-b-16"> 
                                      <Field 
                                        className={`input100 ${errors.email && touched.email ? styles.errorField : ''}`} 
                                        type="text" 
                                        name="email" 
                                        placeholder="Email"
                                      />
                                      {errors.email && touched.email ? 
                                        <div className={styles.error}>{errors.email}</div> 
                                        : null
                                      }
                                      <span className="focus-input100"></span> 
                                      <span className="symbol-input100"> 
                                        <span className="glyphicon glyphicon-user"></span> 
                                      </span> 
                                    </div>
                                    <div className="wrap-input100 validate-input m-b-16"> 
                                    <Field 
                                      className={`input100 ${errors.password && touched.password ? styles.errorField : ''}`} 
                                      type="password" 
                                      name="password" 
                                      placeholder="Senha"/>

                                    {errors.password && touched.password ? 
                                        <div className={styles.error}>{errors.password}</div> 
                                      : null
                                    }
                                    <span className="focus-input100"></span> 
                                    <span className="symbol-input100"> 
                                      <span className="glyphicon glyphicon-lock"></span> 
                                      </span> 
                                    </div>
                                    <div className="flex-sb-m w-full p-b-30">
                                        <div className="contact100-form-checkbox"> 
                                          {/* <input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" />  */}
                                          {/* <label className="label-checkbox100"> Remember me </label>  */}
                                        </div>
                                        {/* <div> <a href="#" className="txt1"> Forgot Password? </a> </div> */}
                                    </div>
                                    <div className="container-login100-form-btn p-t-25"> 
                                      <button type="submit" className="btn btn-outline-primary btn-lg" style={{width: '100%'}} disabled={isSubmitting}> 
                                        <RiLoginCircleLine size="24" style={{marginRight: '5px'}} />
                                        Acessar 
                                      </button> 
                                    </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                    </div>
                    <div className="col-md-6">
                        
                    </div>
                </div>
            </div>
          </div>
      </div>
    </>
  )
}
export default withRouter(SignInPage);