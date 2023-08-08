import styles from './workoutVinculateModal.module.scss';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { VscSave } from 'react-icons/vsc';
import { ImCancelCircle } from 'react-icons/im';
import { handleError, saveWorkoutOnCategory } from '../../../../services/workout.service';
import { searchPreWorkout } from '../../../../services/preWorkout.service';
import { WorkoutOnCategory } from '../../workoutEdit.page';
import { v4 as uuidv4 } from 'uuid';

interface WorkoutVinculateModalComponentProps {
  show: boolean;
  workoutId: string;
  handleClose: () => void;
  workoutOnCategory: WorkoutOnCategory[]
}

export type PreWorkoutList = {
  id: string;
  description: string;
  toAdd?: boolean;
}

export function WorkoutVinculateModalComponent({
  show,
  workoutId,
  handleClose,
  workoutOnCategory
}: WorkoutVinculateModalComponentProps) {
  
  const [preWorkoutList, setPreWorkoutList] = useState<PreWorkoutList[]>([]);

  useEffect(() => {
    if(show) {
      fetchData();
    }
  }, [show, workoutOnCategory]);

  const fetchData = async () => {
    try {
      await searchPreWorkout((data:  PreWorkoutList[]) => {
        const resp = data.map(item => ({...item, toAdd: false}))
        const result = resp.filter(a => !workoutOnCategory.some(b => b.description === a.description));
        
        setPreWorkoutList(result);
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleCheckbox = (toAdd: boolean, id: string) => {
    setPreWorkoutList(prev => prev.map(preWorkout => preWorkout.id === id ? { ...preWorkout, toAdd } : preWorkout));
  };

  const handleSave = async () => {
    try {
      preWorkoutList
      .filter(preWorkout => preWorkout.toAdd)
      .map(async preWorkout => {
        const workoutCategoryId = uuidv4()
        saveWorkoutOnCategory({
          id: workoutCategoryId,
          workoutId, 
          description: preWorkout.description
        })

        // const preWorkoutOnExercise = await getPreWorkoutOnExerciseByPreWorkoutId(preWorkout.id)

        // if (preWorkoutOnExercise) {
        //   // preWorkoutOnExercise.map(preWorkoutExercise => 
        //   //   saveWorkoutOnExercise({
        //   //     workoutCategoryId,
        //   //     exerciseId : preWorkoutExercise.exerciseId,
        //   //     order : preWorkoutExercise.order,
        //   //     restTime : preWorkoutExercise.restTime,
        //   //     series : preWorkoutExercise.series,
        //   //     repetitions : preWorkoutExercise.repetitions,
        //   //     weight : preWorkoutExercise.weight,
        //   //     observation : preWorkoutExercise.observation
        //   //   })
        //   // )
        // }
      })
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
                <Table preWorkoutList={preWorkoutList} handleCheckbox={handleCheckbox} sliderClasses={sliderClasses} />
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

function Table({ preWorkoutList, handleCheckbox, sliderClasses } : any) {
  return (
    <table className="table">
      {preWorkoutList.length > 0 
        ? <tbody>
            {preWorkoutList.map((data: any) => (
              <tr key={data.id}>
                <td>
                  <div className={styles.checkboxContainer}>
                    <label className={styles.switch}>
                      <input type="checkbox" name="toAdd" checked={data.toAdd} onChange={() => handleCheckbox(!data.toAdd, data.id)}/>
                      <span className={sliderClasses}></span>
                    </label>
                    <span className={styles.description}>{data.description}</span>
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


