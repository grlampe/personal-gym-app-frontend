import 'react-toastify/dist/ReactToastify.css';
import { UserListPage } from "./pages/user/userList.page"
import { Switch, Route, Redirect } from "react-router-dom";
import { HomePage } from "./pages/home/home.page";
import { UserEditPage } from "./pages/user/userEdit.page";
import { isAuthenticated } from './services/auth.api';
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