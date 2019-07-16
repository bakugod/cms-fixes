import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { default as RedBox } from 'redbox-react';
import * as MobileDetect from 'mobile-detect';

import { LocaleProvider } from 'antd';
import es_ES from 'antd/es/locale-provider/fr_FR';

import history from './service/Utils/history';
import { configureStore } from './store';

import App from './containers/App/App';

import './static/scss/main.scss';

const store = configureStore();
const root: HTMLElement = document.getElementById('root');

try {
  render(
    <Provider store={store}>
      <Router history={history}>
        <div className='app'>
          <LocaleProvider locale={es_ES}>
            <App />
          </LocaleProvider>
        </div>
      </Router>
    </Provider>,
    root,
  );
} catch (error) {
  render(<RedBox error={error} />, root);
}
