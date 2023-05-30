import { useHistory } from 'react-router-dom';
import { ButtonsFormComponent } from '../../../components/buttonsForm/buttonsForm.component';
import { Form, Formik } from 'formik';

interface ExerciseVinculateModalComponentProps {
  show: boolean;
  exerciseId: string;
}

export const ExerciseVinculateModalComponent: React.FC<ExerciseVinculateModalComponentProps> = ({ show, exerciseId }) => {
  const history = useHistory();
  
  return (
    <Formik
      initialValues={undefined}
      onSubmit={(values, actions) => {
        handleClose()
      }}
    >
      {({isSubmitting, errors, touched})=>(
        <Form>  
          {show ? (
              <div className="modal show" style={{ display: 'block' }}>
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Vincular Categorias</h4>
                    </div>
                    <div className="modal-body">
                      <p>Algum texto aqui.</p>
                    </div>
                    <div className="modal-footer">
                      <ButtonsFormComponent isSubmitting={false} />
                    </div>
                  </div>
                </div>
              </div>
          ) : null}
        </Form>
      )}
    </Formik>
  );
}
