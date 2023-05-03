import './sidenav.styles.css';
import miniLogoWithoutBg from '/assets/img/app-logo.png';
import { NavLink } from 'react-router-dom';
import styles from './sidenav.module.scss';
import { VscHome, VscPerson, VscGear } from 'react-icons/vsc';

export function SideNavComponent() {

  return (
      <div className="sidebar" data-color="white" data-active-color="danger">
        <div className="logo">
          <a href="#" className="simple-text logo-normal">
              <img src={miniLogoWithoutBg}/>
          </a>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            <li>
                <NavLink exact activeClassName={styles.active} to={'/home'}>
                  <VscHome className={styles.menuIcon} />
                  Início
                </NavLink>
            </li>
            <li className="nav-item has-submenu">
		          <a className="nav-link" href="#"> 
                <VscGear className={styles.menuIcon}/>
                Cadastros 
              </a>
              <ul className="submenu collapse">
              <li>
                <NavLink  activeClassName={styles.active} to={'/user'}>
                    <VscPerson className={styles.menuIcon} />
                    Usuários
                </NavLink>
              </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
  )
}