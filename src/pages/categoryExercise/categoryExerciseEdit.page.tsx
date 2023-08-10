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
import { getCategoryExerciseById, saveCategoryExercise, updateCategoryExercise } from "../../services/categoryExercise.service";

type CategoryExerciseEditParams = {
  id: string,
};

export type CategoryExerciseForm = {
  name: string,
  active: boolean,
};

export function CategoryExerciseEditPage() {
  const history = useHistory();

  const { setPageTitle } = useContext(TitlePageContext);
  
  const { id } = useParams<CategoryExerciseEditParams>();

  const [initialValues, setInitialValues] = useState<CategoryExerciseForm>({
    name: '',
    active: true,
  });

  useEffect(() =>{
    setPageTitle(id ? 'Editando Categoria de Exercícios' : 'Cadastrando Categoria de Exercícios');
    setCategoryExerciseData();
  },[]);

  const setCategoryExerciseData = async () => {
    if (id) {
      const data = await getCategoryExerciseById(id);
      setInitialValues({...data});
    }
  }

  const userSchema = Yup.object().shape({
    name: Yup.string().required('Categoria do Exercício é necessária!'),
  });

  const handleSubmit = async (values: CategoryExerciseForm, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await userSchema.validate(values);
      if (id) {
        await updateCategoryExercise(values);
      } else {
        await saveCategoryExercise(values);
      }
    } catch (error) {
      emitWarnToast("Preencha os dados corretamente!");
    }
    
    history.push('/categoryExercise');
    setSubmitting(true);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={userSchema}
      onSubmit={handleSubmit}
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
          </div>
          <ButtonsFormComponent isSubmitting={isSubmitting}/>
        </Form>
      )} 
    </Formik>
  )
}