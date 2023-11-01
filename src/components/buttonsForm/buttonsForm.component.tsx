import styles from './buttonsFormStyles.module.scss';
import { VscSave } from 'react-icons/vsc';
import { ImCancelCircle } from 'react-icons/im';
import classNames from 'classnames';
import { ConfirmModalComponent } from '../modals/confirmModal.component';

type ButtonsFormProps = {
  isSubmitting: boolean,
  funcToExc?: any
}

export function ButtonsFormComponent(props: ButtonsFormProps) {
  const btnSaveClasses = classNames({
    "btn btn-outline-success": true,
    [styles.buttonsForm]: true,
  });

  const btnCancelClasses = classNames({
    "btn btn-outline-danger": true,
    [styles.buttonsForm]: true,
  });

  return (
    <>
      <div className={styles.containerButtonsForm}>
        <button 
          type="submit" 
          className={btnSaveClasses}
        >
          <VscSave className={styles.buttonIcons}/>
          Salvar
        </button>
        
        <button 
          type="button"
          data-toggle="modal" 
          data-target="#backToList" 
          className={btnCancelClasses}>
          <ImCancelCircle className={styles.buttonIcons}/>
          Cancelar
        </button>
      </div>

      <ConfirmModalComponent
        funcToExc={props.funcToExc}
        idModal="backToList"
        description="Deseja realmente cancelar esta operação?"
        confirmButtonDescription="Sim"
        cancelButtonDescription="Não"
      />
    </>
  )

}