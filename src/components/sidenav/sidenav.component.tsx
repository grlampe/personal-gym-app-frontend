import './sidenav.styles.css';
import miniLogoWithoutBg from '/assets/img/app-logo.png';
import { NavLink } from 'react-router-dom';
import styles from './sidenav.module.scss';
import { VscHome, VscPerson, VscGear } from 'react-icons/vsc';
import { BiBuilding } from 'react-icons/bi';
import { urls } from '../../utils/consts';

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
                <NavLink exact activeClassName={styles.active} to={urls.home}>
                  <VscHome className={styles.menuIcon} />
                  Início
                </NavLink>
            </li>
            <li className="nav-item has-submenu">
		          <a className="nav-link" href="#"> 
                <VscGear className={styles.menuIcon}/>Configurações 
              </a>
              <ul className="submenu collapse">
              <li>
                <NavLink  activeClassName={styles.active} to={urls.companyList}>
                    <BiBuilding className={styles.menuIcon} />
                    Empresas
                </NavLink>
              </li>
              <li>
                <NavLink  activeClassName={styles.active} to={urls.userList}>
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