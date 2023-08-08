import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useHistory, useParams } from "react-router-dom";
import {
  saveReceivingBills,
  searchReceivingBillsById,
  updateReceivingBills,
} from "../../services/receivingBills.service";
import { DateUtils } from "../../utils/date";
import { searchUsers } from "../../services/user.service";
import * as Yup from "yup";
import { emitWarnToast } from "../../utils/toast.utils";
import { Form, Formik } from "formik";
import { InputForm } from "../../components/inputForm/inputForm.component";
import { ButtonsFormComponent } from "../../components/buttonsForm/buttonsForm.component";
import moment from "moment";

type ReceivingBillsEditParams = {
  id: string;
};

export type ReceivingBillsForm = {
  userId: string;
  description: string;
  amount: number;
  expirationAt: string;
  paidAt?: string;
  user?: {
    name: string;
  };
};

type UsersList = {
  id: string;
  name: string;
};

export function ReceivingBillsEditPage() {
  const history = useHistory();
  const { setPageTitle } = useContext(TitlePageContext);

  const { id } = useParams<ReceivingBillsEditParams>();
  const [userList, setUserList] = useState<UsersList[]>([]);

  const [initialValues, setInitialValues] = useState<ReceivingBillsForm>({
    userId: "",
    description: "",
    amount: 0,
    expirationAt: moment().add(1, "months").format("YYYY-MM-DD"),
    user: {
      name: "",
    },
  });

  useEffect(() => {
    setPageTitle(
      id ? "Editando Recebimentos" : "Cadastrando Recebimentos"
    );
    setReceivingBillsData();
  }, [id, setPageTitle]);

  const setReceivingBillsData = async () => {
    searchUsers().then((data) => {
      setUserList(data);
    });

    if (id) {
      const receivingBills = await searchReceivingBillsById(id);

      if (receivingBills.paidAt) {
        receivingBills.paidAt = DateUtils.formatDateToBackend(
          receivingBills.paidAt
        );
      }

      if (receivingBills.expirationAt) {
        receivingBills.expirationAt = DateUtils.formatDateToBackend(
          receivingBills.expirationAt
        );
      }

      setInitialValues(receivingBills);
    }
  };

  const receivingBillsSchema = Yup.object().shape({
    userId: Yup.string().required("Usuário é necessário!"),
    description: Yup.string().required("Descrição é necessário!"),
    amount: Yup.number()
      .required("Valor é necessário!")
      .min(0.001, "Valor é necessário!"),
  });

  const handleSubmit = async (
    values: ReceivingBillsForm,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await receivingBillsSchema.validate(values);
      if (id) {
        await updateReceivingBills(values);
      } else {
        await saveReceivingBills(values);
      }
      history.push("/receivingBills");
    } catch (error) {
      emitWarnToast("Preencha os dados corretamente!");
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={receivingBillsSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, values, setValues }) => (
        <Form>
          <div className="form-row">
            <div className="col-md-4 mb-3">
              <p>Usuário</p>
              <select
                className={`form-control ${
                  touched.userId && errors.userId ? "is-invalid" : ""
                }`}
                name="userId"
                value={values.userId}
                onChange={(e) => {
                  const selectedUserId = e.target.value;
                  const selectedUser = userList.find(
                    (user) => user.id === selectedUserId
                  );
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
              {touched.userId && errors.userId && (
                <div className="invalid-feedback">{errors.userId}</div>
              )}
            </div>
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
          </div>
          <div className="form-row">
            <div className="col-md-3 mb-3">
              <InputForm
                name="amount"
                label="Valor"
                type="number"
                errors={errors}
                touched={touched}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-3 mb-3">
              <InputForm
                type="date"
                name="expirationAt"
                label="Data Vencimento"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-md-3 mb-3">
              <InputForm
                type="date"
                name="paidAt"
                label="Data Pagamento"
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
