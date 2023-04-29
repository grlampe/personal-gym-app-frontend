import { ReactNode } from 'react';
import { ButtonMenuComponent } from '../buttonMenu/buttonMenu.component';


type TitlePageProvider = {
  children: ReactNode
}

export function StripedTableComponent(props: TitlePageProvider) {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">
          <ButtonMenuComponent />
        </h4>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            {props.children}
          </table>
        </div>
      </div>
    </div>
  )
}