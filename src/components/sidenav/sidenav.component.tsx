import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { VscHome, VscChevronDown, VscChevronUp, VscChevronRight } from 'react-icons/vsc';

import styles from './sidenav.module.scss';
import miniLogoWithoutBg from '/assets/img/app-logo.png';

interface MenuItem {
  name: string;
  items: string[];
  routes: string[];
  titles: string[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: 'Cadastros',
    items: ['usuarios', 'categoriaExercicios', 'exercicios'],
    routes: ['/user', '/categoryExercise', '/exercise'],
    titles: ['Usuários', 'Categ. de Exercícios', 'Exercícios'],
  },
  {
    name: 'Movimentações',
    items: ['medidas', 'recebimentos', 'preWorkout', 'workout'],
    routes: ['/bodyMeasurement', '/receivingBills', '/preWorkout', '/workout'],
    titles: ['Medidas Corporais', 'Recebimentos', 'Pré-Treino', 'Treino'],
  },
];

export function SideNavComponent() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName === activeMenu ? null : menuName);
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
          {MENU_ITEMS.map((menu, i) => (
            <li key={i} className={`nav-item has-submenu ${activeMenu === menu.name ? 'open' : ''}`}>
              <a className="nav-link" onClick={() => handleMenuClick(menu.name)}>
                {activeMenu === menu.name ? (
                  <VscChevronUp className={styles.menuIcon} />
                ) : (
                  <VscChevronDown className={styles.menuIcon} />
                )}
                {menu.name}
              </a>
              <ul className={`submenu collapse ${activeMenu === menu.name ? 'show' : ''} ${styles.submenu}`}>
                {menu.items.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      exact
                      activeClassName={activeSubMenu === item ? styles.active : ''}
                      to={menu.routes[index]}
                      onClick={() => setActiveSubMenu(item)}
                    >
                      <VscChevronRight className={styles.menuIcon}/>
                      {menu.titles[index]}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
