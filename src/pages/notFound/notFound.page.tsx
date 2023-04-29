import './notFound.style.css';
import { Link } from "react-router-dom";
import { urls } from "../../utils/consts";

export function NotFoundPage() {

  return (
    <>
      <div className="container">
        <div className="body-style">
          <div style={{width:'40%'}}>
            <img src="/assets/img/404.png" style={{float: 'right'}} />
          </div>
            <div style={{width: '45%', float:'left', marginLeft:'50px'}}>
              <h1 style={{fontWeight:'bold',fontSize:'34px',}}>
                Página não encontrada!
              </h1>
              <div style={{fontSize:'25px',textAlign:'left',}}>
                Você pode voltar para o sistema clicando em voltar:
              </div>
              <div>
                <br/>
                <Link to={urls.home}>
                  <button className="btn btn-outline-primary btn-lg">Voltar</button>
                </Link>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}