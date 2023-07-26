import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { InputForm } from "../../components/inputForm/inputForm.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";
import { searchUsers } from "../../services/user.service";
import { emitWarnToast } from "../../utils/toast.utils";
import { saveWorkout, searchWorkoutById, updateWorkout } from "../../services/workout.service";
import { SwitchCheckboxComponent } from "../../components/switchCheckbox/switchCheckbox.component";
import { VscPersonAdd } from "react-icons/vsc";

interface WorkoutEditParams {
  id: string,
};

export interface WorkoutForm {
  userId: string,
  description: string,
  active: boolean,
  user?: {
    name: string;
  };
};

interface UsersList {
  id: string;
  name: string;
};

export function WorkoutEditPage() {
  const { setPageTitle } = useContext(TitlePageContext);
  const { id } = useParams<WorkoutEditParams>();
  const history = useHistory();
  const [userList, setUserList] = useState<UsersList[]>([]);
  const [workout, setWorkout] = useState<WorkoutForm>({ userId: '', description: '', active: true });

  useEffect(() => {
    setPageTitle(id ? 'Editando Treino' : 'Cadastrando Treino');
    fetchWorkoutData();
  }, [id, setPageTitle]);

  const fetchWorkoutData = async () => {
    searchUsers((data: UsersList[]) => {
      setUserList(data);
    });

    if (id) {
      const workout = await searchWorkoutById(id);
      setWorkout(workout);
    }
  };

  const handleSubmit = async (values: WorkoutForm, actions: any) => {
    if (!workoutSchema.isValid(values)) {
      emitWarnToast('Preencha os dados corretamente!');
      return;
    }
    if(id){
      updateWorkout(values);
    } else {
      saveWorkout(values);
    }
    history.push('/workout');
    actions.setSubmitting(true);
  }

  const workoutSchema = Yup.object().shape({
    userId: Yup.string().required("Usuário é necessário!"),
    description: Yup.string().required("Descrição é necessário!"),
  });

  return (
    <Formik
      initialValues={workout}
      enableReinitialize
      validationSchema={workoutSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, values, setValues }) => (
        <Form>
          <div className="form-row">
            <SwitchCheckboxComponent name="active" description="Ativo" />
          </div>
          
          <div className="form-row">
            <div className="col-md-4 mb-3">
              <p>Usuário</p>
              <select
                className={`form-control ${touched.userId && errors.userId ? "is-invalid" : ""}`}
                name="userId"
                value={values.userId}
                onChange={(e) => {
                  const selectedUserId = e.target.value;
                  const selectedUser = userList.find((user) => user.id === selectedUserId);
                  const updatedValues = {
                    ...values,
                    userId: selectedUserId,
                    user: {
                      ...values.user,
                      name: selectedUser?.name || "",
                    },
                  };
                  setValues(updatedValues);
                }}
                disabled={!!id}
              >
                <option value="">Selecione o usuário</option>
                {userList.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {touched.userId && errors.userId && <div className="invalid-feedback">{errors.userId}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="col-md-6 mb-3">
              <InputForm name="description" label="Descrição" errors={errors} touched={touched} />
            </div>
          </div>

          <div className="form-row">
            <div className="col-md-6 mb-1">
              <h3>
                <div className="col-sm-3">
                  <div className="row">
                    <button 
                      type="button" 
                      className="btn btn-outline-info bt-sm"
                      onClick={() => {}}
                    >
                      <VscPersonAdd size="18" style={{ marginRight: '3px' }} />
                      Vincular
                    </button>
                  </div>
                </div>  
              </h3>
            </div> 
          </div>
            
          <ButtonsFormComponent isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  )
}