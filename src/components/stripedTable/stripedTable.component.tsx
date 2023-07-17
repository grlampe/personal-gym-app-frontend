import { ReactNode } from 'react';


type TitlePageProvider = {
  children: ReactNode
}

export function StripedTableComponent(props: TitlePageProvider) {
  return (
    <div className="card">
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