import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './common/stylus/index.styl';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
