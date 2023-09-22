import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../../contexts/titlePage.context";
import { UsersList } from "../../user/userList.page";
import { searchUsers } from "../../../services/user.service";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { ButtonsFormComponent } from "../../../components/buttonsForm/buttonsForm.component";
import moment from "moment";
import { saveAs } from 'file-saver';
import { emitErrorToast } from "../../../utils/toast.utils";
import { getReceivingBillsReport } from "../../../services/receivingBills.service";

export type ReceivingBillsReportForm = {
  isPaidFilter: string;
  userId: string;
};


export function ReceivingBillsReportPage() { 
  const { setPageTitle } = useContext(TitlePageContext);
  const [userList, setUserList] = useState<UsersList[]>([]);
  const [initialValues, setInitialValues] = useState<ReceivingBillsReportForm>({
    isPaidFilter: "0",
    userId: "0",
  })

  useEffect(() => {
    setPageTitle("Relatório de Recebimentos");

    searchUsers().then((data) => {
      setUserList(data.filter(user => user.active === true));
    });

  }, []);

  const receivingBillsReportSchema = Yup.object().shape({
    userId: Yup.string(),
    isPaidFilter: Yup.string(),
  });

  const handleSubmit = async (values: ReceivingBillsReportForm, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await receivingBillsReportSchema.validate(values);

      await getReceivingBillsReport(values).then((buffer: any) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        const dateTimeStr = moment(new Date()).format('DDMMYYYYHHmm');
        saveAs(blob, `relatorio-recebimentos-${dateTimeStr}.xlsx`)
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
      validationSchema={receivingBillsReportSchema}
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
                  const updatedValues = {
                    ...values,
                    userId: selectedUserId,
                  };
                  setValues(updatedValues);
                }}
              >
                <option value="0">Todos os Usuários</option>
                {userList.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {touched.userId && errors.userId && <div className="invalid-feedback">{errors.userId}</div>}
            </div>
            <div className="col-md-4 mb-3">
              <p>Pagos</p>
              <select
                className={`form-control ${touched.isPaidFilter && errors.isPaidFilter ? "is-invalid" : ""}`}
                name="userId"
                value={values.isPaidFilter}
                onChange={async (e) => {
                  const selectedFilter = e.target.value;
                  const updatedValues = {
                    ...values,
                    isPaidFilter: selectedFilter,
                  };
                  setValues(updatedValues);
                }}
              >
                <option value="0">TODOS</option>
                <option value="1">SIM</option>
                <option value="2">NÃO</option>
              </select>
            </div>
          </div>
          <ButtonsFormComponent isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}