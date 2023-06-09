import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useParams } from "react-router";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { InputForm } from "../../components/inputForm/inputForm.component";
import { SwitchCheckboxComponent } from "../../components/switchCheckbox/switchCheckbox.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";
import { emitWarnToast } from "../../utils/toast.utils";
import { useHistory } from 'react-router-dom';
import { getPreWorkoutById, savePreWorkout, updatePreWorkout } from "../../services/preWorkout.service";

export type PreWorkoutEditParams = {
  id: string,
};

export type PreWorkoutForm = {
  description: string,
  active: boolean,
};


export function PreWorkoutEditPage() {
  const history = useHistory();
  const { setPageTitle } = useContext(TitlePageContext);
  const { id } = useParams<PreWorkoutEditParams>();
  const [initialValues, setInitialValues] = useState<PreWorkoutForm>({ description: '', active: true });

  const preWorkoutSchema = Yup.object().shape({
    description: Yup.string().required('Descrição do Pré-Treino é necessária!'),
  });

  useEffect(() => {
    setPageTitle(id ? 'Editando Pré-Treino' : 'Cadastrando Pré-Treino');
    if (id) {
      fetchPreWorkoutData(id);
    }
  }, []);

  const fetchPreWorkoutData = async (preWorkoutId: string) => {
    const data = await getPreWorkoutById(preWorkoutId);
    setInitialValues({...data});
  }

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={preWorkoutSchema}
      onSubmit={(values, actions) => {
        preWorkoutSchema
          .isValid(values)
          .then(valid => {
            if(valid){
              if(id){
                updatePreWorkout(values);
              } else {
                savePreWorkout(values);
              }
              history.push('/preWorkout');
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
                name="description" 
                label="Descrição"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="text-primary">
                    <tr>
                      <th>Descricao</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><input name="myInput" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>          
          <ButtonsFormComponent isSubmitting={isSubmitting}/>
        </Form>
      )} 
    </Formik>
  )
}
