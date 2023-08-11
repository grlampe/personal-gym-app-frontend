import { ChangeEvent, useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useParams } from "react-router";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { InputForm } from "../../components/inputForm/inputForm.component";
import { SwitchCheckboxComponent } from "../../components/switchCheckbox/switchCheckbox.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";
import { emitWarnToast } from "../../utils/toast.utils";
import { useHistory } from 'react-router-dom';
import { VscPersonAdd, VscRemove } from "react-icons/vsc";
import { ExerciseList } from "../exercise/exerciseList.page";
import { deleteWorkoutOnExerciseById, getWorkoutOnCategoryById, getWorkoutOnExerciseByWorkoutCategoryId, saveWorkoutOnCategory, updateWorkoutOnCategory, updateWorkoutOnExercise } from "../../services/workout.service";
import { WorkoutAddExerciseModalComponent } from "./modals/workoutAddExercise.page";

export type WorkoutOnExerciseParams = {
  workoutId: string,
  id: string
};

export type WorkoutOnCategoryForm = {
  workoutId: string,
  description: string,
  active: boolean,
};

export type WorkoutOnExerciseList = {
  id?: string,
  workoutOnCategoryId: string,
  exerciseId: string,
  exercise?: ExerciseList,
  order:        number,
  restTime:     string,
  series:       number,
  repetitions:  string,
  weight:       number,
  observation:  string,
};

export function WorkoutOnExercisePage() {
  const { setPageTitle } = useContext(TitlePageContext);
  const { workoutId, id } = useParams<WorkoutOnExerciseParams>();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState<WorkoutOnCategoryForm>({ workoutId, description: '', active: true });
  const [workoutOnExercise, setWorkoutOnExercise] = useState<WorkoutOnExerciseList[]>([]);

  const workoutOnCategory = Yup.object().shape({
    description: Yup.string().required('Descrição da Categoria do Exercício é necessária!'),
  });

  useEffect(() => {
    setPageTitle(id ? 'Editando Categoria do Exercício' : 'Cadastrando Categoria do Exercício');
    if (id) {
      fetchFullWorkoutData(id);
    }
  }, []);

  const fetchFullWorkoutData = async (id: string) => {
    const data = await getWorkoutOnCategoryById(id);
    setInitialValues({...data});
    const workoutOnExercise = await getWorkoutOnExerciseByWorkoutCategoryId(id)
    setWorkoutOnExercise(workoutOnExercise);
  }

  const handleDelete = async (workoutOnExerciseId: string) => {
    await deleteWorkoutOnExerciseById(workoutOnExerciseId);
    if (id) {
      await fetchFullWorkoutData(id);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    if (id) {
      fetchFullWorkoutData(id);
    }
  }

  const openModalAssign = () => {
    if (!id) {
      emitWarnToast('O Cadastro deve ser salvo antes de realizar os vínculos!');
      return;
    }
    handleShow();
  };

  const handleSubmit = async (values: WorkoutOnCategoryForm, actions: any) => {
    if (!workoutOnCategory.isValid(values)) {
      emitWarnToast('Preencha os dados corretamente!');
      return;
    }
    if(id){
      updateWorkoutOnCategory(values);
      if (workoutOnExercise.length > 0) {
        updateWorkoutOnExercise(workoutOnExercise)
      }
    } else {
      saveWorkoutOnCategory(values);
    }
    
    history.goBack()
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, index: number, field: keyof WorkoutOnExerciseList) => {
    const newData = [...workoutOnExercise]
    newData[index][field] = typeof(newData[index][field]) === 'number' ? Number(event.target.value) : event.target.value
    setWorkoutOnExercise(newData);
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={workoutOnCategory}
      onSubmit={handleSubmit}
    >
      {({isSubmitting, errors, touched})=>(
        <Form>
          <WorkoutAddExerciseModalComponent show={show} workoutOnCategoryId={id} handleClose={handleClose} workoutOnExercise={workoutOnExercise} />

          <div className="form-row">
            <SwitchCheckboxComponent name="active" description="Ativo" />
          </div>

          <div className="form-row">
            <div className="col-md-6 mb-3">
              <InputForm 
                name="description" 
                label="Descrição"
                errors={errors}
                touched={touched}
              />
            </div>
          </div>   

          <WorkoutOnExerciseList
            workoutOnExercise={workoutOnExercise}
            openModalAssign={openModalAssign}
            handleDelete={handleDelete}
            handleInputChange={handleInputChange}
          />
                 
          <ButtonsFormComponent isSubmitting={isSubmitting}/>
        </Form>
      )} 
    </Formik>
  )
}

const WorkoutOnExerciseList = ({ workoutOnExercise, openModalAssign, handleDelete, handleInputChange }: any) => (
  <div className="form-row">
    <div className="col-md-12 mb-1">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">
            <div className="col-sm-3">
              <div className="row">
                <button 
                  type="button" 
                  className="btn btn-outline-info bt-sm"
                  onClick={openModalAssign}
                >
                  <VscPersonAdd size="18" style={{ marginRight: '3px' }} />
                  Vincular
                </button>
              </div>
            </div>  
          </h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="text-primary">
                <tr>
                  <th>Exercícios</th>
                  <th>Ordem</th>
                  <th>Descanso</th>
                  <th>Series</th>
                  <th>Repetições</th>
                  <th>Peso</th>
                  <th>OBS</th>
                </tr>
              </thead>
              {workoutOnExercise.length > 0 ?
                <WorkoutOnExercise workoutOnExercise={workoutOnExercise} handleDelete={handleDelete} handleInputChange={handleInputChange} />
                : <tbody><tr><td>Nenhum dado encontrado...</td></tr></tbody>
              }
            </table>
          </div>
        </div>
      </div>
    </div> 
  </div>
)

const WorkoutOnExercise = ({ workoutOnExercise, handleDelete, handleInputChange }: any) => (
  <tbody>
    { workoutOnExercise.map((data: WorkoutOnExerciseList , index: number )=> (
      <tr key={index} style={{ color: !data.exercise?.active ? 'red' : 'none'}}>
        <td>{data.exercise?.name}</td>
        <td>
          <input
            style={{width: '100%'}}
            type="number"
            value={data.order}
            onChange={event => handleInputChange(event, index, "order")}
          />
        </td>
        <td>
          <input
            style={{width: '100%'}}
            type="text"
            value={data.restTime}
            onChange={event => handleInputChange(event, index, "restTime")}
          />
        </td>
        <td>
          <input
            style={{width: '100%'}}
            type="number"
            value={data.series}
            onChange={event => handleInputChange(event, index, "series")}
          />
        </td>
        <td>
          <input
            style={{width: '100%'}}
            type="text"
            value={data.repetitions}
            onChange={event => handleInputChange(event, index, "repetitions")}
          />
        </td>
        <td>
          <input
            style={{width: '100%'}}
            type="number"
            value={data.weight}
            onChange={event => handleInputChange(event, index, "weight")}
          />
        </td>
        <td>
          <textarea
            value={data.observation}
            onChange={event => handleInputChange(event, index, "observation")}
          >
          </textarea>
        </td>
        <td>
          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              className="btn btn-outline-info"
              onClick={() => handleDelete(data.id)}
            >
              <VscRemove size="14" />
            </button>
          </div>  
        </td>
      </tr>
    ))}
  </tbody>
)