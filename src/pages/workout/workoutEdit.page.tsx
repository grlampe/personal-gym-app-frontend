import { useContext, useEffect, useState } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { useHistory, useParams } from "react-router-dom";

interface WorkoutEditParams {
  id: string,
};

interface WorkoutForm {
  description: string,
  active: boolean,
};

export function WorkoutEditPage() {
  const { setPageTitle } = useContext(TitlePageContext);
  const { id } = useParams<WorkoutEditParams>();
  const history = useHistory();
  const [workout, setWorkout] = useState<WorkoutForm>({ description: '', active: true });

  useEffect(() => {
    setPageTitle(id ? 'Editando Treino' : 'Cadastrando Treino');
    if (id) {
      // fetchWorkoutData(id);
    }
  }, []);

  return (
    <>
    </>
  )
}