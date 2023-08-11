import styles from './ExerciseVinculate.module.scss';
import { useEffect, useState } from 'react';
import { VscSave } from 'react-icons/vsc';
import { ImCancelCircle } from 'react-icons/im';
import classNames from 'classnames';
import { emitSuccessToast } from '../../../utils/toast.utils';
import { searchCategoryExercise } from '../../../services/categoryExercise.service';
import { handleError, saveExerciseOnCategoryExercise } from '../../../services/exercise.service';
import { ExerciseOnCategoryExerciseList } from '../exerciseEdit.page';

interface ExerciseVinculateModalComponentProps {
  show: boolean;
  exerciseId: string;
  handleClose: () => void;
  exerciseOnCategoryExercise: ExerciseOnCategoryExerciseList[]
}

export type CategoryExerciseList = {
  id: string;
  name: string;
  active: boolean;
  toAdd?: boolean;
}

export function ExerciseVinculateModalComponent({
  show,
  exerciseId,
  handleClose,
  exerciseOnCategoryExercise
}: ExerciseVinculateModalComponentProps) {
  
  const [categoryExercise, setCategoryExercise] = useState<CategoryExerciseList[]>([]);

  useEffect(() => {
    if(show) {
      fetchData();
    }
  }, [show, exerciseOnCategoryExercise]);

  const fetchData = async () => {
    try {
      await searchCategoryExercise((data:  CategoryExerciseList[]) => {
        const resp = data.filter(category => category.active === true).map(item => ({...item, toAdd: false}))
        const result = resp.filter(category => !exerciseOnCategoryExercise.some(exercise => exercise.categoryExerciseId === category.id));
        
        setCategoryExercise(result);
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleCheckbox = (toAdd: boolean, id: string) => {
    setCategoryExercise(prev => prev.map(category => category.id === id ? { ...category, toAdd } : category));
  };

  const handleSave = async () => {
    try {
      await Promise.all(
        categoryExercise
          .filter(category => category.toAdd)
          .map(category => saveExerciseOnCategoryExercise({ exerciseId, categoryExerciseId: category.id }))
      );
      handleClose();
      emitSuccessToast('Categorias Vinculadas com sucesso!');
    } catch (error) {
      handleError(error);
    }
  }

  const btnSaveClasses = classNames("btn btn-outline-success", styles.buttonsForm);
  const btnCancelClasses = classNames("btn btn-outline-danger", styles.buttonsForm);
  const sliderClasses = classNames(styles.slider, styles.round);
  
  if (!show) return null;

  return (
    <div className="modal show" style={{ display: 'block' }}>
      <div className="modal-dialog modal-dialog-centered-m">
        <div className="modal-content">
          <div className="modal-header" style={{ maxHeight: 60 }}>
            <h5 className="text-primary">Categoria de Exercício</h5>
          </div>
          <div className="card card-plain">
            <div className="table-responsive" style={{ maxHeight: 400 }}>
              <Table categoryExercise={categoryExercise} handleCheckbox={handleCheckbox} sliderClasses={sliderClasses} />
            </div>
          </div>
          <div className="modal-footer">
            <div className={styles.containerButtonsForm}>
              <button 
                type="button"
                className={btnSaveClasses}
                onClick={handleSave}
              >
                <VscSave className={styles.buttonIcons}/>
                Salvar
              </button>
              <button 
                type="button"
                className={btnCancelClasses}
                onClick={handleClose}
              >
                <ImCancelCircle className={styles.buttonIcons}/>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Table({ categoryExercise, handleCheckbox, sliderClasses } : any) {
  return (
    <table className="table">
      {categoryExercise.length > 0 
        ? <TableCategoryExerciseList categoryExercise={categoryExercise} handleCheckbox={handleCheckbox} sliderClasses={sliderClasses} /> 
        : <NoDataFound />
      } 
    </table>
  );
}

function TableCategoryExerciseList({ categoryExercise, handleCheckbox, sliderClasses } : any) {
  return (
    <tbody>
      {categoryExercise.map((data: any) => (
        <tr key={data.id}>
          <td>
            <div className={styles.checkboxContainer}>
              <label className={styles.switch}>
                <input type="checkbox" name="toAdd" checked={data.toAdd} onChange={() => handleCheckbox(!data.toAdd, data.id)}/>
                <span className={sliderClasses}></span>
              </label>
              <span className={styles.description}>{data.name}</span>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function NoDataFound() {
  return (
    <tbody>
      <tr>
        <td>Nenhum dado encontrado...</td>
      </tr>
    </tbody>
  );
}