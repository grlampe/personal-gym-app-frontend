import classNames from 'classnames';
import styles from './buttonMenu.module.scss';
import { useContext } from 'react';
import { VscPersonAdd, VscSearch } from 'react-icons/vsc';
import { ButtonMenuContext } from '../../contexts/buttonMenu.context';
import { Link } from 'react-router-dom';


export function ButtonMenuComponent(props: any) {
  const {urlToNew, setSearchPressed} = useContext(ButtonMenuContext);


  const inputFilterClass = classNames({
    "form-control": true,
    [styles.inputFilter]: true,
  });   

  return (
    <>
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">
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
            <div className="input-group mb-1">
              <input 
                type="text"
                value={props.searchFilter} 
                className={inputFilterClass} 
                placeholder="Filtrar por..." 
                aria-label="Filtrar por" 
                aria-describedby="button-addon2" 
                onChange={(e) => props.setSearchFilter(e.target.value)}/>
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
        </h4>
      </div>
    </div> 
    </>
  )
}

