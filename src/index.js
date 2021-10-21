import React, {useEffect} from 'react'
import ReactDOM from 'react-dom'
import { Router } from "react-router-dom"
import {createBrowserHistory} from 'history'
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';


import App from './Components/App/App'
import theme from './theme';

// создаём кастомную историю
const history = createBrowserHistory()

/*ReactDOM.render(
    <div>
        <MapboxGLMap/>
    </div>
    , document.getElementById('root')
);*/
ReactDOM.render((
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router history={history}>
                <App/>
            </Router>
        </ThemeProvider>

    ), document.getElementById('root')
); 