import 'react-toastify/dist/ReactToastify.css';
import { UserListPage } from "./pages/user/userList.page";
import { Switch, Route, Redirect } from "react-router-dom";
import { HomePage } from "./pages/home/home.page";
import { UserEditPage } from "./pages/user/userEdit.page";
import { isAuthenticated } from './services/auth.api';
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