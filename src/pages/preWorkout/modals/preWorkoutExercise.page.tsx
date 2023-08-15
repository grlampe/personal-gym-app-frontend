import styles from './preWorkoutExercise.module.scss';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { searchExercise } from '../../../services/exercise.service';
import { PreWorkoutOnExerciseList } from '../preWorkoutEdit.page';
import { VscSave } from 'react-icons/vsc';
import { ImCancelCircle } from 'react-icons/im';
import { savePreWorkoutOnExercise } from '../../../services/preWorkout.service';
import { CategoryExerciseList } from '../../categoryExercise/categoryExerciseList.page';
import { searchCategoryExercise } from '../../../services/categoryExercise.service';
import { ExerciseOnCategoryExerciseList } from '../../exercise/exerciseEdit.page';

interface PreWorkoutExerciseModalComponentProps {
  show: boolean;
  preWorkoutId: string;
  handleClose: () => void;
  preWorkoutOnExercise: PreWorkoutOnExerciseList[]
}

type ExerciseList = {
  id: string;
  name: string;
  active: boolean
  ExerciseOnCategoryExercise?: ExerciseOnCategoryExerciseList[];
  toAdd?: boolean;
}

export function PreWorkoutExerciseModalComponent({
  show,
  preWorkoutId,
  handleClose,
  preWorkoutOnExercise
}: PreWorkoutExerciseModalComponentProps) {
  
  const [exerciseList, setExerciseList] = useState<ExerciseList[]>([]);
  const [filteredCategoryId, setFilteredCategoryId] = useState("");
  const [categoryExerciseList, setCategoryExerciseList] = useState<CategoryExerciseList[]>([]);

  useEffect(() => {
    if(show) {
      fetchData();
      fetchDataCategory();
    }
  }, [show, preWorkoutOnExercise]);

  const fetchData = () => {
    searchExercise((data:  ExerciseList[]) => {
      const resp = data.filter(item => item.active === true).map(item => ({...item, toAdd: false}))
      const result = resp.filter(a => !preWorkoutOnExercise.some(b => b.exerciseId === a.id));
      
      setExerciseList(result);
    });
  };

  const fetchDataCategory = () => {
    searchCategoryExercise((data: CategoryExerciseList[]) => {
      const result = data.filter(item => item.active === true);

      setCategoryExerciseList(result)
    })
  }

  const handleCheckbox = (toAdd: boolean, id: string) => {
    setExerciseList(prev => prev.map(exercise => exercise.id === id ? { ...exercise, toAdd } : exercise));
  };

  const handleSave = async () => {
    let countOrder = preWorkoutOnExercise.length + 1;
    
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
  }

  const onChangeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value;
    setFilteredCategoryId(categoryId);
  };

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
              <h5 className="text-primary">Exercícios</h5>
            </div>
            <div className="card card-plain">
              <div className="table-responsive" style={{ maxHeight: 400 }}>
                <Table 
                  exerciseList={exerciseList} 
                  handleCheckbox={handleCheckbox} 
                  sliderClasses={sliderClasses} 
                  categoryExerciseList={categoryExerciseList}
                  onChangeFilter={onChangeFilter}
                  filteredCategoryId={filteredCategoryId} />
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

function Table({ exerciseList, handleCheckbox, sliderClasses, categoryExerciseList, onChangeFilter, filteredCategoryId }: any) {
  const filteredExercises = exerciseList.filter((exercise: any) =>
    !filteredCategoryId || exercise.ExerciseOnCategoryExercise?.some((categoryExercise: any) => categoryExercise.categoryExerciseId === filteredCategoryId)
  );
  
  return (
    <>
      <select className='w-full' style={{textAlign: 'center'}} onChange={(event) => onChangeFilter(event)}>
        <option value="">Selecione a Categoria para Filtrar</option>
        {categoryExerciseList.map((category : CategoryExerciseList) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <table className="table">
        {filteredExercises.length > 0 
          ? <tbody>
              {filteredExercises.map((data: any) => (
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
    </>
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


