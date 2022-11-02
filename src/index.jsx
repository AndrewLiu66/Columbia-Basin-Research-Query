import React from 'react'
import App from './app/App'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import * as serviceWorker from './serviceWorker'
import { StyledEngineProvider } from '@mui/styled-engine'
import { CssBaseline } from '@mui/material'
import './index.css';

ReactDOM.render(
    <StyledEngineProvider injectFirst>
        <BrowserRouter>
            <CssBaseline />
            <App />
        </BrowserRouter>
    </StyledEngineProvider>,
    document.getElementById('root')
)

serviceWorker.unregister()
