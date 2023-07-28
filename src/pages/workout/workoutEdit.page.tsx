import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { InputForm } from "../../components/inputForm/inputForm.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";
import { searchUsers } from "../../services/user.service";
import { emitWarnToast } from "../../utils/toast.utils";
import { saveWorkout, searchWorkoutById, searchWorkoutOnCategoryByWorkoutId, updateWorkout } from "../../services/workout.service";
import { SwitchCheckboxComponent } from "../../components/switchCheckbox/switchCheckbox.component";
import { VscEdit, VscPersonAdd, VscRemove } from "react-icons/vsc";

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

export interface WorkoutOnCategory {
  id: string;
  workoutId: string;
  description: string;
  active: boolean;
}

const workoutSchema = Yup.object().shape({
  userId: Yup.string().required("Usuário é necessário!"),
  description: Yup.string().required("Descrição é necessário!"),
});

export function WorkoutEditPage() {
  const { setPageTitle } = useContext(TitlePageContext);
  const { id } = useParams<WorkoutEditParams>();
  const history = useHistory();
  const [userList, setUserList] = useState<UsersList[]>([]);
  const [workout, setWorkout] = useState<WorkoutForm>({ userId: '', description: '', active: true });
  const [workoutOnCategory, setWorkoutOnCategory] = useState<WorkoutOnCategory[]>([]);

  useEffect(() => {
    setPageTitle(id ? 'Editando Treino' : 'Cadastrando Treino');
    fetchWorkoutData();
  }, [id, setPageTitle]);

  const fetchWorkoutData = async () => {
    const users = await searchUsers()
    setUserList(users);

    if (id) {
      const workout = await searchWorkoutById(id);
      setWorkout(workout);
      const workoutOnCategory = await searchWorkoutOnCategoryByWorkoutId(id)
      setWorkoutOnCategory(workoutOnCategory);
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

          <div className="form-row mb-0">
            <h3 className="form-row mb-0">
              <div className="col-md-5">
                  <div className="col-sm">
                    <div className="row">
                      <button 
                        type="button" 
                        className="btn btn-outline-info bt-sm"
                        onClick={() => {}}
                      >
                        <VscPersonAdd size="18" style={{ marginRight: '3px' }} />
                        Adicionar
                      </button>
                    </div>
                  </div> 
              </div> 
              <div className="col-md-5 mb-3">
                  <div className="col-sm">
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
              </div>
            </h3> 
          </div>
          
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="text-primary">
                    <tr>
                      <th>Categorias de Treino</th>
                      <th></th>
                    </tr>
                  </thead>
                  {workoutOnCategory.length > 0 ?
                    <ExerciseCategory workoutOnCategory={workoutOnCategory} />
                    : <tbody><tr><td>Nenhum dado encontrado...</td></tr></tbody>
                  }
                </table>
              </div>
            </div>
          </div>
          
          <ButtonsFormComponent isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  )
}

const ExerciseCategory = ({ workoutOnCategory }: any) => (
  <tbody>
    { workoutOnCategory.map((data: any) => (
      <tr key={data.id}>
        <td>{data.description}</td>
        <td>
          <div className="btn-group p-1" role="group">
            <button
              type="button"
              className="btn btn-outline-info"
            >
              <VscEdit size="14" />
            </button>
          </div> 
          <div className="btn-group p-1" role="group">
            <button
              type="button"
              className="btn btn-outline-info"
            >
              <VscRemove size="14" />
            </button>
          </div>  
        </td>
      </tr>
    ))}
  </tbody>
)