import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { FooterComponent } from '../footer/footer.component';
import HorizontalBarComponent from '../horizontalBar/horizontalBar.component';
import { SideNavComponent } from '../sidenav/sidenav.component';


type ContainerProps = {
  children: ReactNode;
}

export function ContainerComponent(props: ContainerProps) {
  return (
    <>
      <div className="wrapper ">
        <SideNavComponent />
          <div className="main-panel" style={{height: '100vh'}}>
            <HorizontalBarComponent />
              <div className="content">
                {props.children}
              </div>
            <FooterComponent />
          </div>
        </div>
      <ToastContainer/>
    </>
  )

}