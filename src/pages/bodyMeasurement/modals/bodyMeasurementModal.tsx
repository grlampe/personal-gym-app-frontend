import classNames from "classnames";
import { useEffect, useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { VscEdit, VscTrash } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { deleteBodyMeasurement, searchBodyMeasurementByUserId } from "../../../services/bodyMeasurement.service";
import { handleError } from "../../../services/exercise.service";
import { DateUtils } from "../../../utils/date";
import styles from "./BodyMeasurementModal.module.scss";

interface BodyMeasurementModalComponentProps {
  show: boolean;
  userId: string;
  handleClose: () => void;
}

export type BodyMeasurementList = {
  id: string;
  description: string;
  createdAt: string;
};

export function BodyMeasurementModalComponent({
  show,
  userId,
  handleClose,
}: BodyMeasurementModalComponentProps) {
  const [bodyMeasurement, setBodyMeasurement] = useState<BodyMeasurementList[]>(
    []
  );

  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show, bodyMeasurement]);

  const fetchData = () => {
    try {
      searchBodyMeasurementByUserId(
        userId,
        (data: BodyMeasurementList[]) => {
          setBodyMeasurement(data);
        }
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = (id: string) => {
    deleteBodyMeasurement(id).then(() => {
      fetchData();
    })
  }

  const btnCancelClasses = classNames(
    "btn btn-outline-danger",
    styles.buttonsForm
  );

  if (!show) return null;

  return (
    <div className="modal show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered-m">
        <div className="modal-content">
          <div className="modal-header" style={{ maxHeight: 60 }}>
            <h5 className="text-primary">Medidas do Usuário</h5>
          </div>
          <div className="card card-plain">
            <div className="table-responsive" style={{ maxHeight: 400 }}>
              <Table bodyMeasurement={bodyMeasurement} handleDelete={handleDelete}/>
            </div>
          </div>
          <div className="modal-footer">
            <div className={styles.containerButtonsForm}>
              <button
                type="button"
                className={btnCancelClasses}
                onClick={handleClose}
              >
                <ImCancelCircle className={styles.buttonIcons} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Table({ bodyMeasurement, handleDelete }: any) {
  return (
    <table className="table">
      {bodyMeasurement.length > 0 ? (
        <>
        <thead className="text-primary">
          <tr>
            <th>Descrição</th>
            <th>Dt. Medição</th>
            <th>Ação</th>
          </tr>
        </thead>
        <BodyMeasurementListTable bodyMeasurement={bodyMeasurement} handleDelete={handleDelete}/>
        </>
      ) : (
        <NoDataFound />
      )}
    </table>
  );
}

function BodyMeasurementListTable({ bodyMeasurement, handleDelete }: any) {
  return (
    <tbody>
      {bodyMeasurement.map((data: any) => (
        <tr key={data.id}>
          <td>{data.description}</td>
          <td>{DateUtils.formatDateWithoutTime(data.createdAt)}</td>
          <td>
            <div className="btn-group" role="group">
              <Link to={"bodyMeasurement/edit/:id".replace(":id", data.id)}>
                <button type="button" className="btn btn-outline-info">
                  <VscEdit size="14" />
                </button>
              </Link>
              <button type="button" className="btn btn-outline-danger ml-1" onClick={() => handleDelete(data.id)}>
                <VscTrash size="14"/>
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function NoDataFound() {
  return (
    <tbody>
      <tr>
        <td>Nenhum dado encontrado...</td>
      </tr>
    </tbody>
  );
}
