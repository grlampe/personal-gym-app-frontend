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
import { getExerciseById, saveExercise, updateExercise } from "../../services/exercise";
import { VscPersonAdd, VscRemove } from "react-icons/vsc";

type ExerciseEditParams = {
  id: string,
};

export type ExerciseForm = {
  name: string,
  active: boolean,
};

export function ExerciseEditPage() {
  const history = useHistory();

  const { setPageTitle } = useContext(TitlePageContext);
  
  const { id } = useParams<ExerciseEditParams>();

  const [initialValues, setInitialValues] = useState<ExerciseForm>({
    name: '',
    active: true,
  });

  useEffect(() =>{
    setPageTitle(id ? 'Editando Exercícios' : 'Cadastrando Exercícios');
    setExerciseData();
  },[]);

  const setExerciseData = async () => {
    if (id) {
      const data = await getExerciseById(id);
      setInitialValues({...data});
    }
  }

  const userSchema = Yup.object().shape({
    name: Yup.string().required('Nome do Exercício é necessário!'),
  });

  const handleDelete = async (id: string) => {
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
    
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">
                <div className="row">
                  <div className="col-sm-3">
                    <button 
                      type="button" 
                      className="btn btn-outline-info bt-sm"
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
                      <th>Categorias</th>
                      <th></th>
                    </tr>
                  </thead>
                  {initialValues.length > 0 ? (
                    <tbody>
                      {initialValues.map(data => (
                        <tr key={data.id}>
                          <td>{data.name}</td>
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
                  ) : (
                    <tbody>
                      <tr>
                        <td>Nenhum dado encontrado...</td>
                      </tr>
                    </tbody>
                  )}
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