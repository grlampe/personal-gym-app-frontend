import './sidenav.styles.css';
import miniLogoWithoutBg from '/assets/img/app-logo.png';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './sidenav.module.scss';
import { VscHome, VscChevronDown, VscChevronUp, VscChevronRight } from 'react-icons/vsc';

export function SideNavComponent() {
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [cadastroIcon, setCadastroIcon] = useState(<VscChevronDown className={styles.menuIcon} />);

  const handleCadastroToggle = () => {
    setIsCadastroOpen(!isCadastroOpen);
    setCadastroIcon(
      isCadastroOpen ? <VscChevronDown className={styles.menuIcon} /> : <VscChevronUp className={styles.menuIcon} />
    );
  };

  const handleSubMenuClick = (submenuName: any) => {
    setActiveSubMenu(submenuName);
  };

  const isSubMenuActive = (submenuName: any) => {
    return activeSubMenu === submenuName;
  };

  return (
    <div className="sidebar" data-color="white" data-active-color="danger">
      <div className="logo">
        <NavLink to="/" className="simple-text logo-normal">
          <img src={miniLogoWithoutBg} alt="Logo" />
        </NavLink>
      </div>
      <div className="sidebar-wrapper">
        <ul className="nav">
          <li>
            <NavLink exact activeClassName={styles.active} to="/home">
              <VscHome className={styles.menuIcon} />
              Início
            </NavLink>
          </li>
          <li className={`nav-item has-submenu ${isCadastroOpen ? 'open' : ''}`}>
            <a className="nav-link" onClick={handleCadastroToggle}>
              {cadastroIcon}
              Cadastros
            </a>
            <ul className={`submenu collapse ${isCadastroOpen ? 'show' : ''}`}>
              <li>
                <NavLink
                  exact
                  activeClassName={isSubMenuActive('usuarios') ? styles.active : ''}
                  to="/user"
                  onClick={() => handleSubMenuClick('usuarios')}
                >
                  <VscChevronRight className={styles.menuIcon} />
                  Usuários
                </NavLink>
              </li>
              <li>
                <NavLink
                  exact
                  activeClassName={isSubMenuActive('categoriaExercicios') ? styles.active : ''}
                  to="/categoryExercise"
                  onClick={() => handleSubMenuClick('categoriaExercicios')}
                >
                  <VscChevronRight className={styles.menuIcon} />
                  Categ. de Exercícios
                </NavLink>
              </li>
              <li>
                <NavLink
                  exact
                  activeClassName={isSubMenuActive('exercicios') ? styles.active : ''}
                  to="/exercise"
                  onClick={() => handleSubMenuClick('exercicios')}
                >
                  <VscChevronRight className={styles.menuIcon} />
                  Exercícios
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
