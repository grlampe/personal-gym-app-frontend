import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { searchBodyMeasurementById, saveBodyMeasurement, updateBodyMeasurement } from "../../services/bodyMeasurement";
import { searchUsers } from "../../services/user.api";
import { emitWarnToast } from "../../utils/toast.utils";
import { InputForm } from "../../components/inputForm/inputForm.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";

type BodyMeasurementEditParams = {
  id: string;
};

type BodyMeasurementForm = {
  userId: string;
  description: string;
  height: number;
  weight: number;
  chestBust: number;
  leftArm: number;
  rightArm: number;
  abdomen: number;
  waist: number;
  hips: number;
  leftThigh: number;
  rightThigh: number;
  user?: {
    name: string;
  };
};

type UsersList = {
  id: string;
  name: string;
};

export function BodyMeasurementEditPage() {
  const history = useHistory();
  const { setPageTitle } = useContext(TitlePageContext);

  const { id } = useParams<BodyMeasurementEditParams>();
  const [userList, setUserList] = useState<UsersList[]>([]);
  const [initialValues, setInitialValues] = useState<BodyMeasurementForm>({
    userId: "",
    description: "",
    height: 0,
    weight: 0,
    chestBust: 0,
    leftArm: 0,
    rightArm: 0,
    abdomen: 0,
    waist: 0,
    hips: 0,
    leftThigh: 0,
    rightThigh: 0,
    user: {
      name: "",
    },
  });

  useEffect(() => {
    setPageTitle(id ? "Editando Medidas Corporais" : "Cadastrando Medidas Corporais");
    setBodyMeasurementData();
  }, [id, setPageTitle]);

  const setBodyMeasurementData = async () => {
    searchUsers((data: UsersList[]) => {
      setUserList(data);
    });

    if (id) {
      const bodyMeasurement = await searchBodyMeasurementById(id);
      setInitialValues(bodyMeasurement);
    }
  };

  const bodyMeasurementSchema = Yup.object().shape({
    userId: Yup.string().required("Usuário é necessário!"),
    description: Yup.string().required("Descrição é necessário!"),
    height: Yup.number().required("Medida do Busto é necessário!").min(0.001, "Medida do Busto é necessário!"),
    weight: Yup.number().required("Medida do Busto é necessário!").min(0.001, "Medida do Busto é necessário!"),
    chestBust: Yup.number().required("Medida do Busto é necessário!").min(0.001, "Medida do Busto é necessário!"),
    leftArm: Yup.number().required("Medida do Braço Esquerdo é necessária!").min(0.001, "Medida do Braço Esquerdo é necessária!"),
    rightArm: Yup.number().required("Medida do Braço Direito é necessário!").min(0.001, "Medida do Braço Direito é necessário!"),
    abdomen: Yup.number().required("Medida do Abdômen é necessário!").min(0.001, "Medida do Abdômen é necessário!"),
    waist: Yup.number().required("Medida da Cintura é necessária!").min(0.001, "Medida da Cintura é necessária!"),
    hips: Yup.number().required("Medida do Quadril é necessário!").min(0.001, "Medida do Quadril é necessário!"),
    leftThigh: Yup.number().required("Medida da Coxa Esquerda é necessária!").min(0.001, "Medida da Coxa Esquerda é necessária!"),
    rightThigh: Yup.number().required("Medida da Coxa Direita é necessária!").min(0.001, "Medida da Coxa Direita é necessária!"),
  });

  const handleSubmit = async (values: BodyMeasurementForm, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await bodyMeasurementSchema.validate(values);
      if (id) {
        await updateBodyMeasurement(values);
      } else {
        await saveBodyMeasurement(values);
      }
      history.push("/bodyMeasurement");
    } catch (error) {
      emitWarnToast("Preencha os dados corretamente!");
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={bodyMeasurementSchema}
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
            <div className="col-md-3 mb-3">
              <InputForm name="height" label="Altura" type="number" errors={errors} touched={touched} />
            </div>
            <div className="col-md-3 mb-3">
              <InputForm name="weight" label="Peso" type="number" errors={errors} touched={touched} />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-3 mb-3">
              <InputForm name="chestBust" label="Medida do Busto" type="number" errors={errors} touched={touched} />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-3 mb-3">
              <InputForm name="leftArm" label="Medida do Braço Esquerdo" type="number" errors={errors} touched={touched} />
            </div>
            <div className="col-md-3 mb-3">
              <InputForm name="rightArm" label="Medida do Braço Direito" type="number" errors={errors} touched={touched} />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-3 mb-3">
              <InputForm name="abdomen" label="Medida do Abdômen" type="number" errors={errors} touched={touched} />
            </div>
            <div className="col-md-3 mb-3">
              <InputForm name="waist" label="Medida da Cintura" type="number" errors={errors} touched={touched} />
            </div>
            <div className="col-md-3 mb-3">
              <InputForm name="hips" label="Medida do Quadril" type="number" errors={errors} touched={touched} />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-3 mb-3">
              <InputForm name="leftThigh" label="Medida da Coxa Esquerda" type="number" errors={errors} touched={touched} />
            </div>
            <div className="col-md-3 mb-3">
              <InputForm name="rightThigh" label="Medida da Coxa Direita" type="number" errors={errors} touched={touched} />
            </div>
          </div>
          <ButtonsFormComponent isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}
