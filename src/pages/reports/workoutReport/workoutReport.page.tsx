import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../../contexts/titlePage.context";
import { UsersList } from "../../user/userList.page";
import { WorkoutList } from "../../workout/modals/workoutList/workoutListModal";
import { searchUsers } from "../../../services/user.service";
import { getWorkoutReport, searchWorkoutByUserId } from "../../../services/workout.service";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { ButtonsFormComponent } from "../../../components/buttonsForm/buttonsForm.component";
import moment from "moment";
import { saveAs } from 'file-saver';
import { emitErrorToast } from "../../../utils/toast.utils";
import { ExerciseList } from "../../exercise/exerciseList.page";
import { searchExercise } from "../../../services/exercise.service";

export type WorkoutReportForm = {
  userId: string;
  workoutId: string;
  exerciseId: string;
};


export function WorkoutReportPage() { 
  const { setPageTitle } = useContext(TitlePageContext);
  const [userList, setUserList] = useState<UsersList[]>([]);
  const [workoutList, setWorkoutList] = useState<WorkoutList[]>([]);
  const [exerciseList, setExerciseList] = useState<ExerciseList[]>([]);
  const [initialValues, setInitialValues] = useState<WorkoutReportForm>({
    userId: "",
    workoutId: "0",
    exerciseId: "0",
  })

  useEffect(() => {
    setPageTitle("Consulta Treinos");

    searchUsers().then((data) => {
      setUserList(data.filter(user => user.active === true));
    });

    searchExercise((data: ExerciseList[]) => {
      setExerciseList(data);
    });
  }, []);

  const setWorkoutData = async (userId: string) => {
    await searchWorkoutByUserId(
      userId,
      (data: WorkoutList[]) => {
        setWorkoutList(data);
      }
    );
  }

  const workoutReportSchema = Yup.object().shape({
    userId: Yup.string().required("Usuário é necessário!"),
    workoutId: Yup.string(),
    exerciseId: Yup.string(),
  });

  const handleSubmit = async (values: WorkoutReportForm, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await workoutReportSchema.validate(values);

      await getWorkoutReport(values).then((buffer: any) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        const dateTimeStr = moment(new Date()).format('DDMMYYYYHHmm');
        saveAs(blob, `consulta-treinos-${dateTimeStr}.xlsx`)
      })
    } catch (error: any) {
      emitErrorToast(error.message);
    }

    setSubmitting(true);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={workoutReportSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, values, setValues }) => (
        <Form>
          <div className="form-row">
            <div className="col-md-4 mb-3">
              <p>Usuário</p>
              <select
                className={`form-control ${touched.userId && errors.userId ? "is-invalid" : ""}`}
                name="userId"
                value={values.userId}
                onChange={async (e) => {
                  const selectedUserId = e.target.value;
                  await setWorkoutData(selectedUserId);
                  const updatedValues = {
                    ...values,
                    userId: selectedUserId,
                  };
                  setValues(updatedValues);
                }}
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
            <div className="col-md-4 mb-3">
              <p>Treino</p>
              <select
                className={`form-control ${touched.workoutId && errors.workoutId ? "is-invalid" : ""}`}
                name="workoutId"
                value={values.workoutId}
                onChange={(e) => {
                  const selectedWorkoutId = e.target.value;
                  const updatedValues = {
                    ...values,
                    workoutId: selectedWorkoutId,
                  };
                  setValues(updatedValues);
                }}
              >
                <option value="0">Selecione o Treino</option>
                {workoutList.map((workout) => (
                  <option key={workout.id} value={workout.id}>
                    {workout.description}
                  </option>
                ))}
              </select>
              {touched.workoutId && errors.workoutId && <div className="invalid-feedback">{errors.workoutId}</div>}
            </div>
          </div>
          <div className="form-row">
          <div className="col-md-4 mb-3">
              <p>Exercício</p>
              <select
                className={`form-control ${touched.exerciseId && errors.exerciseId ? "is-invalid" : ""}`}
                name="exerciseId"
                value={values.exerciseId}
                onChange={(e) => {
                  const selectedExerciseId = e.target.value;
                  const updatedValues = {
                    ...values,
                    exerciseId: selectedExerciseId,
                  };
                  setValues(updatedValues);
                }}
              >
                <option value="0">Selecione o Treino</option>
                {exerciseList.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </option>
                ))}
              </select>
              {touched.exerciseId && errors.exerciseId && <div className="invalid-feedback">{errors.exerciseId}</div>}
            </div>
          </div>
          <ButtonsFormComponent isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}