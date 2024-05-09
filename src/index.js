import React from 'react';
import './index.scss';

import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import rootstore from './component/Redux/rootStore';
import { LanguageProvider } from './component/Lang/LanguageProvider'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={rootstore}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
);


