import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
// import { BrowserRouter, HashRouter } from 'react-router-dom';
import IpfsRouter from 'ipfs-react-router'; // For IPFS Hosting
import store from './store/store';

ReactDOM.render(
    <IpfsRouter>
        <Provider store={store}>
            <App />
            {/* <React.StrictMode>
                <App />
            </React.StrictMode> */}
        </Provider>
    </IpfsRouter>,
	document.getElementById('root')
);
