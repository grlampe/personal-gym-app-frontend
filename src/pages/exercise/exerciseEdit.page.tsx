import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useParams, useHistory } from "react-router";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { deleteExerciseOnCategoryExerciseById, getExerciseById, getExerciseOnCategoryExerciseByExerciseId, saveExercise, updateExercise } from "../../services/exercise.service";
import { VscPersonAdd, VscTrash } from "react-icons/vsc";
import { ExerciseVinculateModalComponent } from "./modals/exerciseVinculate.page";
import { InputForm } from "../../components/inputForm/inputForm.component";
import { SwitchCheckboxComponent } from "../../components/switchCheckbox/switchCheckbox.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";
import { emitWarnToast } from "../../utils/toast.utils";
import { CategoryExerciseList } from "../categoryExercise/categoryExerciseList.page";

export type ExerciseEditParams = {
  id: string,
};

export type ExerciseForm = {
  name: string,
  active: boolean,
};

export type ExerciseOnCategoryExerciseList = {
  id: string,
  exerciseId: string,
  categoryExerciseId: string
  categoryExercise: CategoryExerciseList
};

export function ExerciseEditPage() {
  const { setPageTitle } = useContext(TitlePageContext);
  const { id } = useParams<ExerciseEditParams>();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState<ExerciseForm>({ name: '', active: true });
  const [exerciseOnCategoryExercise, setExerciseOnCategoryExercise] = useState<ExerciseOnCategoryExerciseList[]>([]);
  
  const userSchema = Yup.object().shape({
    name: Yup.string().required('Nome do Exercício é necessário!'),
  });

  useEffect(() => {
    setPageTitle(id ? 'Editando Exercícios' : 'Cadastrando Exercícios');
    if (id) {
      fetchExerciseData(id);
    }
  }, []);

  const fetchExerciseData = async (exerciseId: string) => {
    const data = await getExerciseById(exerciseId);
    setInitialValues({...data});
    const exerciseOnCategory = await getExerciseOnCategoryExerciseByExerciseId(exerciseId)
    setExerciseOnCategoryExercise(exerciseOnCategory.filter(exercise => exercise.categoryExercise.active === true));
  }

  const handleDelete = async (ExerciseOnCategoryExerciseId: string) => {
    await deleteExerciseOnCategoryExerciseById(ExerciseOnCategoryExerciseId);
    if (id) {
      await fetchExerciseData(id);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    if (id) {
      fetchExerciseData(id);
    }
  }

  const openModalAssign = () => {
    if (!id) {
      emitWarnToast('O Exercício deve ser salvo antes de realizar os vínculos!');
      return;
    }
    handleShow();
  };

  const handleSubmit = async (values: ExerciseForm, actions: any) => {
    if (!userSchema.isValid(values)) {
      emitWarnToast('Preencha os dados corretamente!');
      return;
    }
    if(id){
      await updateExercise(values);
    } else {
      await saveExercise(values);
    }

    actions.setSubmitting(true);

    history.push('/exercise');
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={userSchema}
      onSubmit={handleSubmit}
    >
      {({isSubmitting, errors, touched}) => (
        <Form>
          <ExerciseVinculateModalComponent show={show} exerciseId={id} handleClose={handleClose} exerciseOnCategoryExercise={exerciseOnCategoryExercise} />

          <div className="form-row">
            <SwitchCheckboxComponent name="active" description="Ativo" />
          </div>

          <div className="form-row">
            <div className="col-md-6 mb-3">
              <InputForm name="name" label="Nome" errors={errors} touched={touched} />
            </div>
          </div>

          <ExerciseList
            exerciseOnCategoryExercise={exerciseOnCategoryExercise}
            openModalAssign={openModalAssign}
            handleDelete={handleDelete}
          />

          <ButtonsFormComponent isSubmitting={isSubmitting} />
        </Form>  
      )} 
    </Formik>
  )
}

const ExerciseList = ({ exerciseOnCategoryExercise, openModalAssign, handleDelete }: any) => (
  <div className="form-row">
    <div className="col-md-6 mb-1">
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
                  <th>Categorias Vinculadas</th>
                  <th></th>
                </tr>
              </thead>
              {exerciseOnCategoryExercise.length > 0 ?
                <ExerciseCategory exerciseOnCategoryExercise={exerciseOnCategoryExercise} handleDelete={handleDelete} />
                : <tbody><tr><td>Nenhum dado encontrado...</td></tr></tbody>
              }
            </table>
          </div>
        </div>
      </div>
    </div> 
  </div>
)

const ExerciseCategory = ({ exerciseOnCategoryExercise, handleDelete }: any) => (
  <tbody>
    { exerciseOnCategoryExercise.map((data: any) => (
      <tr key={data.id}>
        <td>{data.categoryExercise.name}</td>
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
