import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { TitlePageContext } from "../../../contexts/titlePage.context";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { ButtonsFormComponent } from "../../../components/buttonsForm/buttonsForm.component";
import moment from "moment";
import { saveAs } from 'file-saver';
import { emitErrorToast } from "../../../utils/toast.utils";
import { getSimpleUserReport } from "../../../services/user.service";

export type SimpleUserReportForm = {
  activeFilter: string;
};


export function SimpleUserReportPage() { 
  const history = useHistory();
  const { setPageTitle } = useContext(TitlePageContext);
  const [initialValues, setInitialValues] = useState<SimpleUserReportForm>({
    activeFilter: "0",
  })

  useEffect(() => {
    setPageTitle("Relatório de Clientes");
  }, []);

  const simpleUserReportSchema = Yup.object().shape({
    activeFilter: Yup.string(),
  });

  const handleSubmit = async (values: SimpleUserReportForm, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await simpleUserReportSchema.validate(values);

      await getSimpleUserReport(values).then((buffer: any) => {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });

        const dateTimeStr = moment(new Date()).format('DDMMYYYYHHmm');
        saveAs(blob, `relatorio-clientes-${dateTimeStr}.xlsx`)
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
      validationSchema={simpleUserReportSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, touched, errors, values, setValues }) => (
        <Form>
          <div className="form-row">
            <div className="col-md-4 mb-3">
              <p>Ativo</p>
              <select
                className={`form-control ${touched.activeFilter && errors.activeFilter ? "is-invalid" : ""}`}
                name="userId"
                value={values.activeFilter}
                onChange={async (e) => {
                  const selectedFilter = e.target.value;
                  const updatedValues = {
                    ...values,
                    activeFilter: selectedFilter,
                  };
                  setValues(updatedValues);
                }}
              >
                <option value="0">TODOS</option>
                <option value="1">ATIVOS</option>
                <option value="2">INATIVOS</option>
              </select>
            </div>
          </div>
          <ButtonsFormComponent isSubmitting={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
}