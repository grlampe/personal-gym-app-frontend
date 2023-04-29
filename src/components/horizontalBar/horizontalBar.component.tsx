import { useContext } from "react";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { RiLogoutCircleRLine } from 'react-icons/ri';
import styles from './horizontalBar.module.scss';
import { AuthContext } from "../../contexts/auth.context";
import { ConfirmModalComponent } from "../modals/confirmModal.component";
import { withRouter, useHistory } from "react-router-dom";
import { urls } from "../../utils/consts";

function HorizontalBarComponent() {
  const { pageTitle } = useContext(TitlePageContext);
  const { signOut, currentUser } = useContext(AuthContext);
  const history = useHistory();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
        <div className="container-fluid">
          <div className="navbar-wrapper">
            <div className="navbar-toggle">
              <button type="button" className="navbar-toggler">
                <span className="navbar-toggler-bar bar1"></span>
                <span className="navbar-toggler-bar bar2"></span>
                <span className="navbar-toggler-bar bar3"></span>
              </button>
            </div>
            <a className="navbar-brand">{pageTitle}</a>
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-bar navbar-kebab"></span>
            <span className="navbar-toggler-bar navbar-kebab"></span>
            <span className="navbar-toggler-bar navbar-kebab"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navigation">

            <div className="d-flex flex-column bd-highlight text-right" style={{padding: '0px 30px', height: '40px'}}>
              <p className="p-1 bd-highlight text-primary"style={{margin: '0 !important', padding: '5px 2px !important', height: '12px'}}>
                <strong>{currentUser?.companyName}</strong>
                </p>
              <p className="p-1 bd-highlight text-primary"style={{margin: '0 !important', padding: '5px 2px !important', height: '12px'}}>
                <strong>{currentUser?.fullName}</strong>
              </p>
            </div>

            <button 
              type="button" 
              className="btn btn-outline-danger"
              data-toggle="modal" 
              data-target="#logoutSystem" 
            >
              <RiLogoutCircleRLine className={styles.exitIcon}/>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <ConfirmModalComponent
        funcToExc={() => { 
          signOut();
          history.push(urls.login);
          window.location.reload();
        }}
        idModal="logoutSystem"
        description="Deseja realmente sair do sistema?"
        confirmButtonDescription="Sim"
        cancelButtonDescription="Não"
      />
    </>
  )
}


export default withRouter(HorizontalBarComponent);