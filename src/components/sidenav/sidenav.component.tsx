import './sidenav.styles.css';
import miniLogoWithoutBg from '/assets/img/app-logo.png';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import styles from './sidenav.module.scss';
import { VscHome, VscPerson, VscChevronDown, VscChevronUp } from 'react-icons/vsc';

export function SideNavComponent() {
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [cadastroIcon, setCadastroIcon] = useState(<VscChevronDown className={styles.menuIcon} />);

  const handleCadastroToggle = () => {
    setIsCadastroOpen(!isCadastroOpen);
    setCadastroIcon(
      isCadastroOpen ? <VscChevronDown className={styles.menuIcon} /> : <VscChevronUp className={styles.menuIcon} />
    );
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
                <NavLink activeClassName={styles.active} to="/user">
                  <VscPerson className={styles.menuIcon} />
                  Usuários
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
