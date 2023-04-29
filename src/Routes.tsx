import 'react-toastify/dist/ReactToastify.css';
import { UserListPage } from "./pages/user/userList.page"
import { Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/home/home.page";
import { UserEditPage } from "./pages/user/userEdit.page";
import { urls } from "./utils/consts";
import { isAuthenticated } from './services/auth.api';
import { Redirect } from 'react-router-dom';
import SignInPage from './pages/signIn/signIn.page';
import { ContainerComponent } from './components/container/container.component';
import { NotFoundPage } from './pages/notFound/notFound.page';

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
        <Redirect to={{ pathname: urls.home, state: { from: props.location } }} />
      ) : (
        <rest.comp {...props} />
      )
    }
  />
);

export function Routes() {

  return (
    <Switch>
      {/*  TO-DO -- TIRAR A CONSTANTE E PASSAR AS ROTAS DIRETO NO PATH  */}
      {/*  USUARIOS  */}
      <PrivateRoute exact path={urls.userEdit} comp={() => <UserEditPage/>}/>
      <PrivateRoute exact path={urls.userNew} comp={() =>  <UserEditPage/>}/>
      <PrivateRoute exact path={urls.userList} comp={() => <UserListPage/>}/>
      
      {/* HOME */}
      <PrivateRoute exact path={urls.home} comp={() => <HomePage />}/>
      
      {/* LOGIN */}
      <LoginRoute exact path="/" comp={() => <SignInPage />} />

      <Route path="*" component={() => <NotFoundPage/>} />  
    </Switch>
  )
}