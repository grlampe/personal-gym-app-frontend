import { Field } from 'formik';
import styles from './inputFormStyle.module.scss';

type TInputProps = {
  name: string,
  label: string,
  type?: string,
  errors: any,
  touched: any,
}

export function InputForm(props: TInputProps) {
  const { name, label, type, errors, touched } = props;

  const getField = ():JSX.Element => {
    if(!!type){
      return <Field 
        className={`form-control form-control-sm ${errors[name] && touched[name] ? styles.errorField : ''}`}
        type={type} 
        name={name} 
      />;
    } else {
      return <Field 
        className={`form-control form-control-sm ${errors[name] && touched[name] ? styles.errorField : ''}`}
        name={name} 
      />;
    }
  }

  return (
    <>
      <label>{label}</label>
      {getField()}
      {errors[name] && touched[name] ? 
        <div className={styles.error}>{errors[name]}</div> 
        : null}
    </>
  )
}