import styles from './exerciseVinculate.module.scss';
import { useEffect, useState } from 'react';
import { searchCategoryExercise } from '../../../services/categoryExercise';
import { VscSave } from 'react-icons/vsc';
import { ImCancelCircle } from 'react-icons/im';
import classNames from 'classnames';

interface ExerciseVinculateModalComponentProps {
  show: boolean;
  exerciseId: string;
  handleClose: () => void;
}

export type CategoryExerciseList = {
  id: string;
  name: string;
  toAdd?: boolean;
}

export function ExerciseVinculateModalComponent({ show, exerciseId, handleClose }: ExerciseVinculateModalComponentProps) {
  const [categoryExercise, setCategoryExercise] = useState<CategoryExerciseList[]>([]);

  useEffect(() =>{
    executeOnModalLoad();
  },[]);

  const executeOnModalLoad = () => {
    searchCategoryExercise((data:  CategoryExerciseList[]) => {
      const resp = data.map(item => ({...item, toAdd: true}))
      setCategoryExercise(resp);
    });
  };

  const handleCheckbox = (toAdd: boolean, id: string) => {
    let categories = [...categoryExercise]

    categories.forEach(category => {
      if (category.id === id) {
        category.toAdd = toAdd
      }
    }); 
    
    setCategoryExercise(categories);
  };


  const btnSaveClasses = classNames({
    "btn btn-outline-success": true,
    [styles.buttonsForm]: true,
  });

  const btnCancelClasses = classNames({
    "btn btn-outline-danger": true,
    [styles.buttonsForm]: true,
  });

  const sliderClasses = classNames({
    [styles.slider]: true,
    [styles.round]: true,
  });
  
  return (
    <>
      {show ? (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-m">
            <div className="modal-content">
                <div className="card card-plain">
                  <table className="table">
                    <thead className="text-primary">
                      <tr>
                        <th>Categoria de Exercício</th>
                      </tr>
                    </thead>
                    {categoryExercise.length > 0 ?
                    <tbody>
                    { categoryExercise.map(data => {
                      return (
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
                      )
                    })}
                    </tbody> : <tbody><tr><td>Nenhum dado encontrado...</td></tr></tbody>
                    } 
                  </table>
                </div>
              <div className="modal-footer">
              <div className={styles.containerButtonsForm}>
                <button 
                  type="button"
                  className={btnSaveClasses}
                >
                  <VscSave className={styles.buttonIcons}/>
                  Salvar
                </button>
                
                <button 
                  type="button"
                  className={btnCancelClasses}
                  onClick={handleClose}>
                  <ImCancelCircle className={styles.buttonIcons}/>
                  Cancelar
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}