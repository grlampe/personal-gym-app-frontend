import classNames from 'classnames';
import styles from './buttonMenu.module.scss';
import { useContext } from 'react';
import { VscPersonAdd, VscSearch } from 'react-icons/vsc';
import { ButtonMenuContext } from '../../contexts/buttonMenu.context';
import { Link } from 'react-router-dom';


export function ButtonMenuComponent() {
  const {urlToNew, setSearchPressed} = useContext(ButtonMenuContext);


  const inputFilterClass = classNames({
    "form-control": true,
    [styles.inputFilter]: true,
  });   

  return (
    <>
      <div className="row">
        <div className="col-sm-3">
          <Link to={urlToNew}>
            <button 
              type="button" 
              className="btn btn-outline-info bt-sm">
              <VscPersonAdd size="18" style={{marginRight: '3px'}}/>
              Novo
            </button>

          </Link>
        </div>

        <div className="col-sm-9">
          <div className="input-group mb-3">
            <input 
              type="text" 
              className={inputFilterClass} 
              placeholder="Filtrar por..." 
              aria-label="Filtrar por" 
              aria-describedby="button-addon2" />
            <div className="input-group-append">
              <button 
                onClick={()=> setSearchPressed(true)}
                className={styles.filterButton} 
                type="button" 
                id="button-addon2">
                <VscSearch size="18" style={{marginRight: '3px'}}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

