import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useParams } from "react-router";
import { InputForm } from "../../components/inputForm/inputForm.component";
import { SwitchCheckboxComponent } from "../../components/switchCheckbox/switchCheckbox.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { emitWarnToast } from "../../utils/toast.utils";
import {
  Formik,
  Form,
} from 'formik';
import { deleteExerciseOnCategoryExerciseById, getExerciseById, getExerciseOnCategoryExerciseByExerciseId, saveExercise, updateExercise } from "../../services/exercise";
import { VscPersonAdd, VscRemove } from "react-icons/vsc";
import { CategoryExerciseList } from "../categoryExercise/categoryExerciseList.page";
import { ExerciseVinculateModalComponent } from "./modals/exerciseVinculate.page";

type ExerciseEditParams = {
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
  const history = useHistory();

  const { setPageTitle } = useContext(TitlePageContext);
  
  const { id } = useParams<ExerciseEditParams>();

  const [initialValues, setInitialValues] = useState<ExerciseForm>({
    name: '',
    active: true,
  });

  const [exerciseOnCategoryExercise, setExerciseOnCategoryExercise] = useState<ExerciseOnCategoryExerciseList[]>([]);

  useEffect(() =>{
    setPageTitle(id ? 'Editando Exercícios' : 'Cadastrando Exercícios');
    setExerciseData();
  },[]);

  const setExerciseData = async () => {
    if (id) {
      const data = await getExerciseById(id);
      setInitialValues({...data});
      getExerciseOnCategoryExerciseData(id)
    }
  }

  const getExerciseOnCategoryExerciseData = async (id: string) => {
    const exerciseOnCategory = await getExerciseOnCategoryExerciseByExerciseId(id)
      setExerciseOnCategoryExercise(exerciseOnCategory);
  }

  const userSchema = Yup.object().shape({
    name: Yup.string().required('Nome do Exercício é necessário!'),
  });

  const handleDelete = async (id: string) => {
    await deleteExerciseOnCategoryExerciseById(id);
    await getExerciseOnCategoryExerciseData(id)
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const openModalAssign = async (data: any) => {
    if (!!id) {
      handleShow();
    } else {
      emitWarnToast('O Exercício deve ser salvo antes de realizar os vínculos!')
    }  
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={userSchema}
      onSubmit={(values, actions) => {
        userSchema
          .isValid(values)
          .then(valid => {
            if(valid){
              if(id){
                updateExercise(values);
              } else {
                saveExercise(values);
              }
              history.push('/exercise');
            } else {
              emitWarnToast('Preencha os dados corretamente!');
            }
            actions.setSubmitting(true);
          })
      }}
    >
      {({isSubmitting, errors, touched})=>(
      <Form>

      <ExerciseVinculateModalComponent show={show} exerciseId={id} handleClose={handleClose} />
            
      <div className="form-row">
        <SwitchCheckboxComponent name="active" description="Ativo" />
      </div>
    
      <div className="form-row">
        <div className="col-md-6 mb-3">
          <InputForm 
            name="name" 
            label="Nome"
            errors={errors}
            touched={touched}
          />
        </div>
      </div>

      <div className="form-row"> 
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                <div className="col-sm-3">
                  <div className="row">
                      <button 
                        type="button" 
                        className="btn btn-outline-info bt-sm"
                        onClick={() => openModalAssign(id)}
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
                    <tbody>
                    { exerciseOnCategoryExercise.map(data => {
                      return (
                        <tr key={data.id}>
                          <td>{data.categoryExercise.name}</td>
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
                      )
                    })}
                  </tbody> : <tbody><tr><td>Nenhum dado encontrado...</td></tr></tbody>
                  }
                </table>
              </div>
            </div>
          </div>
        </div> 
      </div>
      <ButtonsFormComponent isSubmitting={isSubmitting} />
    </Form>  
    )} 
    </Formik>
  )
}