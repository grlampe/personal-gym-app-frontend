import React from 'react'
import ReactDOM from 'react-dom';
import { BrowserRouter, Router } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './contexts/auth.context';
import { ButtonMenuProvider } from './contexts/buttonMenu.context';
import { TitlePageProvider } from './contexts/titlePage.context';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <TitlePageProvider>
          <ButtonMenuProvider>
            <App />
          </ButtonMenuProvider>
        </TitlePageProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
