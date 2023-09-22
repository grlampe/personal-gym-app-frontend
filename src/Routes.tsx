import 'react-toastify/dist/ReactToastify.css';
import { UserListPage } from "./pages/user/userList.page";
import { Switch, Route, Redirect } from "react-router-dom";
import { HomePage } from "./pages/home/home.page";
import { UserEditPage } from "./pages/user/userEdit.page";
import { isAuthenticated } from './services/auth.service';
import SignInPage from './pages/signIn/signIn.page';
import { ContainerComponent } from './components/container/container.component';
import { NotFoundPage } from './pages/notFound/notFound.page';
import { CategoryExerciseListPage } from './pages/categoryExercise/categoryExerciseList.page';
import { CategoryExerciseEditPage } from './pages/categoryExercise/categoryExerciseEdit.page';
import { ExerciseEditPage } from './pages/exercise/exerciseEdit.page';
import { ExerciseListPage } from './pages/exercise/exerciseList.page';
import { BodyMeasurementEditPage } from './pages/bodyMeasurement/bodyMeasurementEdit.page';
import { BodyMeasurementListPage } from './pages/bodyMeasurement/bodyMeasurementList.page';
import { ReceivingBillsListPage } from './pages/receivingBills/receivingBillsList.page';
import { ReceivingBillsEditPage } from './pages/receivingBills/receivingBillsEdit.page';
import { PreWorkoutListPage } from './pages/preWorkout/preWorkoutList.page';
import { PreWorkoutEditPage } from './pages/preWorkout/preWorkoutEdit.page';
import { WorkoutEditPage } from './pages/workout/workoutEdit.page';
import { WorkoutListPage } from './pages/workout/workoutList.page';
import { WorkoutOnExercisePage } from './pages/workoutExercise/workoutExercise.page';
import { BodyMeasurementReportPage } from './pages/reports/bodyMeasurementReport/bodyMeasurementReport.page';
import { SimpleUserReportPage } from './pages/reports/simpleUserReport/simpleUserReport.page';
import { ReceivingBillsReportPage } from './pages/reports/receivingBillsReport/receivingBillsReport.page';

const PrivateRoute = (rest: any) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <ContainerComponent> 
          <rest.comp {...props} />
        </ContainerComponent>
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const LoginRoute = (rest: any) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Redirect to={{ pathname: '/home', state: { from: props.location } }} />
      ) : (
        <rest.comp {...props} />
      )
    }
  />
);

export function Routes() {

  return (
    <Switch>
      {/*  Relatórios  */}
      <PrivateRoute exact path={'/bodyMeasurementReport'} comp={() => <BodyMeasurementReportPage />} />
      <PrivateRoute exact path={'/simpleUserReport'} comp={() => <SimpleUserReportPage />} />
      <PrivateRoute exact path={'/receivingBillsReport'} comp={() => <ReceivingBillsReportPage />} />
      <PrivateRoute exact path={'/workoutReport'} comp={() => <SimpleUserReportPage />} />
      
      {/*  Treino  */}
      <PrivateRoute exact path={'/workout/edit/:workoutId/workoutExercise/edit/:id'} comp={() => <WorkoutOnExercisePage/>}/>
      <PrivateRoute exact path={'/workout/edit/:workoutId/workoutExercise/new'} comp={() => <WorkoutOnExercisePage/>}/>
      <PrivateRoute exact path={'/workout/edit/:id'} comp={() => <WorkoutEditPage/>}/>
      <PrivateRoute exact path={'/workout/new'} comp={() =>  <WorkoutEditPage/>}/>
      <PrivateRoute exact path={'/workout'} comp={() => <WorkoutListPage/>}/>

      {/*  Pré-Treino  */}
      <PrivateRoute exact path={'/preWorkout/edit/:id'} comp={() => <PreWorkoutEditPage/>}/>
      <PrivateRoute exact path={'/preWorkout/new'} comp={() =>  <PreWorkoutEditPage/>}/>
      <PrivateRoute exact path={'/preWorkout'} comp={() => <PreWorkoutListPage/>}/>

      {/*  Contas a Receber  */}
      <PrivateRoute exact path={'/receivingBills/edit/:id'} comp={() => <ReceivingBillsEditPage/>}/>
      <PrivateRoute exact path={'/receivingBills/new'} comp={() =>  <ReceivingBillsEditPage/>}/>
      <PrivateRoute exact path={'/receivingBills'} comp={() => <ReceivingBillsListPage/>}/>

      {/*  Medidas Corporais  */}
      <PrivateRoute exact path={'/bodyMeasurement/edit/:id'} comp={() => <BodyMeasurementEditPage/>}/>
      <PrivateRoute exact path={'/bodyMeasurement/new'} comp={() =>  <BodyMeasurementEditPage/>}/>
      <PrivateRoute exact path={'/bodyMeasurement'} comp={() => <BodyMeasurementListPage/>}/>

      {/*  Exercicio  */}
      <PrivateRoute exact path={'/exercise/edit/:id'} comp={() => <ExerciseEditPage/>}/>
      <PrivateRoute exact path={'/exercise/new'} comp={() =>  <ExerciseEditPage/>}/>
      <PrivateRoute exact path={'/exercise'} comp={() => <ExerciseListPage/>}/>

      {/*  Categoria de Exercicio  */}
      <PrivateRoute exact path={'/categoryExercise/edit/:id'} comp={() => <CategoryExerciseEditPage/>}/>
      <PrivateRoute exact path={'/categoryExercise/new'} comp={() =>  <CategoryExerciseEditPage/>}/>
      <PrivateRoute exact path={'/categoryExercise'} comp={() => <CategoryExerciseListPage/>}/>

      {/*  USUARIOS  */}
      <PrivateRoute exact path={'/user/edit/:id'} comp={() => <UserEditPage/>}/>
      <PrivateRoute exact path={'/user/new'} comp={() =>  <UserEditPage/>}/>
      <PrivateRoute exact path={'/user'} comp={() => <UserListPage/>}/>
      
      {/* HOME */}
      <PrivateRoute exact path={'/home'} comp={() => <HomePage />}/>
      
      {/* LOGIN */}
      <LoginRoute exact path="/" comp={() => <SignInPage />} />

      <Route path="*" component={() => <NotFoundPage/>} />  


    </Switch>
  )
}