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
import { deletePreWorkoutOnExerciseById, getPreWorkoutById, getPreWorkoutOnExerciseByPreWorkoutId, savePreWorkout, updatePreWorkout, updatePreWorkoutOnExercise } from "../../services/preWorkout.service";
import { VscPersonAdd, VscTrash } from "react-icons/vsc";
import { ExerciseList } from "../exercise/exerciseList.page";
import { PreWorkoutExerciseModalComponent } from "./modals/preWorkoutExercise.page";

export type PreWorkoutEditParams = {
  id: string,
};

export type PreWorkoutForm = {
  description: string,
  active: boolean,
};

export type PreWorkoutOnExerciseList = {
  id?: string,
  preWorkoutId: string,
  exerciseId: string,
  exercise?: ExerciseList,
  order:        number,
  restTime:     string,
  series:       number,
  repetitions:  string,
  weight:       number,
  observation:  string,
};

export function PreWorkoutEditPage() {
  const { setPageTitle } = useContext(TitlePageContext);
  const { id } = useParams<PreWorkoutEditParams>();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState<PreWorkoutForm>({ description: '', active: true });
  const [preWorkoutOnExercise, setPreWorkoutOnExercise] = useState<PreWorkoutOnExerciseList[]>([]);

  const preWorkoutSchema = Yup.object().shape({
    description: Yup.string().required('Descrição do Treino Padrão é necessária!'),
  });

  useEffect(() => {
    setPageTitle(id ? 'Editando Treino Padrão' : 'Cadastrando Treino Padrão');
    if (id) {
      fetchPreWorkoutData(id);
    }
  }, []);

  const fetchPreWorkoutData = async (preWorkoutId: string) => {
    const data = await getPreWorkoutById(preWorkoutId);
    setInitialValues({...data});
    const preWorkoutOnExercise = await getPreWorkoutOnExerciseByPreWorkoutId(preWorkoutId)
    setPreWorkoutOnExercise(preWorkoutOnExercise);
  }

  const handleDelete = async (preWorkoutOnExerciseId: string) => {
    await deletePreWorkoutOnExerciseById(preWorkoutOnExerciseId);
    if (id) {
      await fetchPreWorkoutData(id);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    if (id) {
      fetchPreWorkoutData(id);
    }
  }

  const openModalAssign = () => {
    if (!id) {
      emitWarnToast('O Cadastro deve ser salvo antes de realizar os vínculos!');
      return;
    }
    handleShow();
  };

  const handleSubmit = async (values: PreWorkoutForm, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await preWorkoutSchema.validate(values);

      if(id){
        updatePreWorkout(values);
        if (preWorkoutOnExercise.length > 0) {
          await updatePreWorkoutOnExercise(preWorkoutOnExercise)
        }
      } else {
        await savePreWorkout(values);
      }

      setSubmitting(true);
    
      if (!id || preWorkoutOnExercise.length > 0) {
        history.push('/preWorkout');
      } 
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        emitWarnToast('Preencha os dados corretamente!');
      }
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>, index: number, field: keyof PreWorkoutOnExerciseList) => {
    const newData = [...preWorkoutOnExercise]
    newData[index][field] = typeof(newData[index][field]) === 'number' ? Number(event.target.value) : event.target.value
    setPreWorkoutOnExercise(newData);
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={preWorkoutSchema}
      onSubmit={handleSubmit}
    >
      {({isSubmitting, errors, touched})=>(
        <Form>
          <PreWorkoutExerciseModalComponent show={show} preWorkoutId={id} handleClose={handleClose} preWorkoutOnExercise={preWorkoutOnExercise} />

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

          <PreWorkoutOnExerciseList
            preWorkoutOnExercise={preWorkoutOnExercise}
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

const PreWorkoutOnExerciseList = ({ preWorkoutOnExercise, openModalAssign, handleDelete, handleInputChange }: any) => (
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
                  <th >Ordem</th>
                  <th>Descanso</th>
                  <th>Series</th>
                  <th>Repetições</th>
                  <th>Peso</th>
                  <th>OBS</th>
                </tr>
              </thead>
              {preWorkoutOnExercise.length > 0 ?
                <PreWorkoutOnExercise preWorkoutOnExercise={preWorkoutOnExercise} handleDelete={handleDelete} handleInputChange={handleInputChange} />
                : <tbody><tr><td>Nenhum dado encontrado...</td></tr></tbody>
              }
            </table>
          </div>
        </div>
      </div>
    </div> 
  </div>
)

const PreWorkoutOnExercise = ({ preWorkoutOnExercise, handleDelete, handleInputChange }: any) => (
  <tbody>
    { preWorkoutOnExercise.map((data: PreWorkoutOnExerciseList , index: number )=> (
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
              className="btn btn-outline-danger"
              onClick={() => handleDelete(data.id)}
            >
              <VscTrash size="14" />
            </button>
          </div>  
        </td>
      </tr>
    ))}
  </tbody>
)