import styles from './preWorkoutExercise.module.scss';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { handleError, searchExercise } from '../../../services/exercise.service';
import { PreWorkoutOnExerciseList } from '../preWorkoutEdit.page';
import { VscSave } from 'react-icons/vsc';
import { ImCancelCircle } from 'react-icons/im';
import { savePreWorkoutOnExercise } from '../../../services/preWorkout.service';

interface PreWorkoutExerciseModalComponentProps {
  show: boolean;
  preWorkoutId: string;
  handleClose: () => void;
  preWorkoutOnExercise: PreWorkoutOnExerciseList[]
}

export type ExerciseList = {
  id: string;
  name: string;
  toAdd?: boolean;
}

export function PreWorkoutExerciseModalComponent({
  show,
  preWorkoutId,
  handleClose,
  preWorkoutOnExercise
}: PreWorkoutExerciseModalComponentProps) {
  
  const [exerciseList, setExerciseList] = useState<ExerciseList[]>([]);

  useEffect(() => {
    if(show) {
      fetchData();
    }
  }, [show, preWorkoutOnExercise]);

  const fetchData = async () => {
    try {
      await searchExercise((data:  ExerciseList[]) => {
        const resp = data.map(item => ({...item, toAdd: false}))
        const result = resp.filter(a => !preWorkoutOnExercise.some(b => b.exerciseId === a.id));
        
        setExerciseList(result);
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleCheckbox = (toAdd: boolean, id: string) => {
    setExerciseList(prev => prev.map(exercise => exercise.id === id ? { ...exercise, toAdd } : exercise));
  };

  const handleSave = async () => {
    let countOrder = preWorkoutOnExercise.length + 1;

    try {
      await Promise.all(
        exerciseList
          .filter(exercise => exercise.toAdd)
          .map(exercise => savePreWorkoutOnExercise({
            preWorkoutId, 
            exerciseId: exercise.id,
            order: countOrder++,
            restTime: '0',
            series: 0,
            repetitions: '0',
            weight: 0,
            observation: ''
          }))
      );
      handleClose();
    } catch (error) {
      handleError(error);
    }
  }

  const btnSaveClasses = classNames("btn btn-outline-success", styles.buttonsForm);
  const btnCancelClasses = classNames("btn btn-outline-danger", styles.buttonsForm);
  const sliderClasses = classNames(styles.slider, styles.round);
  
  if (!show) return null;

  return (
    <>
      <div className="modal show" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered-m">
          <div className="modal-content">
            <div className="modal-header" style={{ maxHeight: 60 }}>
              <h5 className="text-primary">Categoria de Exercício</h5>
            </div>
            <div className="card card-plain">
              <div className="table-responsive" style={{ maxHeight: 400 }}>
                <Table exerciseList={exerciseList} handleCheckbox={handleCheckbox} sliderClasses={sliderClasses} />
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
    </>
  )
}

function Table({ exerciseList, handleCheckbox, sliderClasses } : any) {
  return (
    <table className="table">
      {exerciseList.length > 0 
        ? <tbody>
            {exerciseList.map((data: any) => (
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
        : <NoDataFound />
      } 
    </table>
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


