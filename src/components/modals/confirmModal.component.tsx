import { useContext } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';
import { useHistory } from 'react-router-dom';

type ConfirmModalProps = {
  title?: string;
  description: string;
  confirmButtonDescription: string;
  cancelButtonDescription: string;
  idModal: string;
  funcToExc?: any;
}

export function ConfirmModalComponent(props: ConfirmModalProps) {
  const history = useHistory();


  return (
    <div className="modal fade" id={props.idModal} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{props.title ? props.title : 'Atenção'}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{props.description}</p>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{fontSize: '10px'}}
              onClick={()=>{
                if(!!props.funcToExc){
                  props.funcToExc();
                } else {
                  history.goBack();
                }
              }}
              data-dismiss="modal"
            >
              <BsCheck2Circle size="14" style={{marginRight: '3px'}}/>
              {props.confirmButtonDescription}
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              style={{fontSize: '10px'}} 
              data-dismiss="modal"
            >
              <ImCancelCircle size="14" style={{marginRight: '3px'}}/>
              {props.cancelButtonDescription}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

}