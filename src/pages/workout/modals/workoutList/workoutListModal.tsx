import { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./workoutListModal.module.scss";
import { ImCancelCircle } from "react-icons/im";
import { Link } from "react-router-dom";
import { VscEdit, VscTrash } from "react-icons/vsc";
import { FcOk } from "react-icons/fc";
import { AiFillCloseCircle } from "react-icons/ai";
import { deleteWorkout, handleError, searchWorkoutByUserId } from "../../../../services/workout.service";

type WorkoutListModalProps = {
  show: boolean;
  userId: string;
  handleClose: () => void;
}

export interface WorkoutList {
  id: string;
  userId: string;
  description: string;
  active: boolean;
};

export function WorkoutListModal({
  show,
  userId,
  handleClose,
}: WorkoutListModalProps) {

  const [workoutList, setWorkoutList] = useState<WorkoutList[]>(
    []
  );

  useEffect(() => {
    if (show) {
      fetchData();
    }
  }, [show, workoutList]);

  const fetchData = async () => {
    try {
      await searchWorkoutByUserId(
        userId,
        (data: WorkoutList[]) => {
          setWorkoutList(data);
        }
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = (id: string) => {
    deleteWorkout(id).then(() => {
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
            <h5 className="text-primary">Treinos do Usuário</h5>
          </div>
          <div className="card card-plain">
            <div className="table-responsive" style={{ maxHeight: 400 }}>
              <Table workoutList={workoutList} handleDelete={handleDelete} />
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

function Table({ workoutList, handleDelete }: any) {
  return (
    <table className="table">
      {workoutList.length > 0 ? (
        <WorkoutListTable workoutList={workoutList} handleDelete={handleDelete} />
      ) : (
        <NoDataFound />
      )}
    </table>
  );
}

function WorkoutListTable({ workoutList, handleDelete }: any) {
  return (
    <tbody>
      {workoutList.map((data: any) => (
        <tr key={data.id}>
          <td>{data.description}</td>
          <td>
            {data.active? 
              <FcOk size="24" /> : 
              <AiFillCloseCircle size="24" style={{color:'#FF3F3F'}}/>}
          </td>
          <td>
            <div className="btn-group" role="group">
              <Link to={"workout/edit/:id".replace(":id", data.id) }>
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