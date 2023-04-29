import styles from './switchCheckboxStyle.module.scss';
import classNames from "classnames";
import { Field } from 'formik';


type SwitchCheckboxProps = {
  name: string,
  description: string,
}

export function SwitchCheckboxComponent(props: SwitchCheckboxProps) {
  const sliderClasses = classNames({
    [styles.slider]: true,
    [styles.round]: true,
  });


  return (
    <div className={styles.checkboxContainer}>
      <label className={styles.switch}>
        <Field type="checkbox" name={props.name} />
        <span className={sliderClasses}></span>
      </label>
      <span className={styles.description}>{props.description}</span>
    </div>
  )

}