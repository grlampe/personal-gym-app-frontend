import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { TitlePageContext } from "../../../contexts/titlePage.context";
import { UsersList } from "../../user/userList.page";
import { WorkoutList } from "../../workout/modals/workoutList/workoutListModal";
import { searchUsers } from "../../../services/user.service";
import { searchWorkoutByUserId } from "../../../services/workout.service";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { ButtonsFormComponent } from "../../../components/buttonsForm/buttonsForm.component";
import { InputForm } from "../../../components/inputForm/inputForm.component";
import { DateUtils } from "../../../utils/date";
import moment from "moment";
import { getBodyMeasurementReport } from "../../../services/bodyMeasurement.service";
import { saveAs } from 'file-saver';

export type BodyMeasurementReportForm = {
  userId: string;
  workoutId: string;
  startDate: string;
  endDate: string;
};


export function BodyMeasurementReportPage() { 
  const history = useHistory();
  const { setPageTitle } = useContext(TitlePageContext);
  const [userList, setUserList] = useState<UsersList[]>([]);
  const [workoutList, setWorkoutList] = useState<WorkoutList[]>([]);
  const [initialValues, setInitialValues] = useState<BodyMeasurementReportForm>({
    userId: "",
    workoutId: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    setPageTitle("Consulta Medidas");

    searchUsers().then((data) => {
      setUserList(data.filter(user => user.active === true));
    });

  }, [userList]);

  const setWorkoutData = async (userId: string) => {
    await searchWorkoutByUserId(
      userId,
      (data: WorkoutList[]) => {
        setWorkoutList(data);
      }
    );
  }

  const bodyMeasurementReportSchema = Yup.object().shape({
    userId: Yup.string().required("Usuário é necessário!"),
    workoutId: Yup.string().notRequired(),
    startDate: Yup.string().when('workoutId', (workoutId, schema) => {
      if (!workoutId) {
        return schema.required("Data Inicial é necessária!")
      }
      return schema
    }),
    endDate: Yup.string().when('workoutId', (workoutId, schema) => {
      if (!workoutId) {
        return schema.required("Data Final é necessária!")
      }
      return schema
    }),
  });

  const handleSubmit = async (values: BodyMeasurementReportForm, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await bodyMeasurementReportSchema.validate(values);

      if (!!values?.workoutId) {
        values.startDate = DateUtils.formatDateToBackend(moment().toString());
        values.endDate = DateUtils.formatDateToBackend(moment().toString());
      }

      if (!values?.workoutId) {
        values.workoutId = '0'
      }

      
      await getBodyMeasurementReport(values).then((buffer: any) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        const dateTimeStr = moment(new Date()).format('DDMMYYYYHHmm');
        saveAs(blob, `consulta-medidas-${dateTimeStr}.xlsx`)
      })
    } catch (error) {
      console.log(error);
    }

    setSubmitting(true);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={bodyMeasurementReportSchema}
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
                  const selectedUser = userList.find((user) => user.id === selectedUserId);
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
                  const selectedWorkout = workoutList.find((workout) => workout.id === selectedWorkoutId);
                  const updatedValues = {
                    ...values,
                    workoutId: selectedWorkoutId,
                  };
                  setValues(updatedValues);
                }}
              >
                <option value="">Selecione o Treino</option>
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
              <InputForm
                type="date"
                name="startDate" 
                label="Data Inicial"
                errors={errors}
                touched={touched}
              />
            </div>

            <div className="col-md-4 mb-3">
              <InputForm
                type="date"
                name="endDate" 
                label="Data Final"
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <ButtonsFormComponent isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}