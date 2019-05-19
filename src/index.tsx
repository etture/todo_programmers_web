import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';
import { stores } from './stores/index';

// MobX에서 state change는 무조건 action을 통해서만 이뤄지도록 강제
configure({ enforceActions: 'observed' });

ReactDOM.render(
	<Provider {...stores}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
	,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
