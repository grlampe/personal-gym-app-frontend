import './signInStyle.css';
import logo from '../../../assets/img/app-logo.png';
import { RiLoginCircleLine } from 'react-icons/ri';
import { Formik, Form, Field } from 'formik';
import { useContext, useState } from 'react';
import * as yup from 'yup';
import styles from './signInStyle.module.scss';
import { AuthContext } from '../../contexts/auth.context';
import { useHistory } from 'react-router-dom';


export type LoginForm = {
  username?: string;
  password?: string;
}

function SignInPage() {
  const { signIn } = useContext(AuthContext);
  const history = useHistory();

  const [initialValues] = useState<LoginForm>({
    username: 'adm@personalgymapp.com',
    password: '123123',
  });

  const loginSchema = yup.object().shape({
    username: yup.string().email('Email inválido!').required('O email é necessário!'),
    password: yup.string().required('A senha é necessária!')
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    await signIn(values);
   
    setSubmitting(true);

    history.push('/home');
  }; 

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
                            validationSchema={loginSchema}
                            enableReinitialize
                            onSubmit={handleSubmit}
                          >
                            {({isSubmitting, errors, touched})=>(
                              <Form className="login100-form validate-form"> 
                                <span className="login100-form-title "> 
                                  <img src={logo} alt="PERSONAL GYM APP" style={{paddingBottom: '20px'}}/> 
                                </span> 
                                <span className="login100-form-subtitle m-b-16"> Entre com seus dados </span>
                                    <div className="wrap-input100 validate-input m-b-16"> 
                                      <Field 
                                        className={`input100 ${errors.username && touched.username ? styles.errorField : ''}`} 
                                        type="text" 
                                        name="username" 
                                        placeholder="Email"
                                      />
                                      {errors.username && touched.username ? 
                                        <div className={styles.error}>{errors.username}</div> 
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
                                        </div>
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
export default SignInPage;