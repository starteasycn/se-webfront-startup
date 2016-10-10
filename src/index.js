import {Router, Route, IndexRedirect, Redirect, IndexRoute, browserHistory, hashHistory} from 'react-router'

import {syncHistoryWithStore} from 'react-router-redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'

//Material-ui
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { amber500 } from 'material-ui/styles/colors';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import AppBar from 'material-ui/AppBar';

import Login from './containers/Login'
import App from './containers/App'
import CommonPage from './containers/CommonPage'
import configure from './store'
import {history} from './services'
import injectTapEventPlugin from 'react-tap-event-plugin';
import TargetCountOfMonth from './containers/TargetCountOfMonth'
import Home from './containers/Home'

import DevTools from './containers/DevTools'

const store = configure()
const historyObj = syncHistoryWithStore(history, store)
const dapTheme = getMuiTheme(lightBaseTheme)
injectTapEventPlugin();

ReactDOM.render(
    <Provider store={store}>
        <div>
            <MuiThemeProvider muiTheme={dapTheme}>
                <Router history={historyObj}>
                    <Route path="/" component={ Login }/>
                    <Route path="/login" component={ Login }>
                    </Route>

                    <Route path="/home" getComponent={ getHomeContainer }>
                        <IndexRoute component={App}/>
                        <Route path="targetCountOfMonth" component={TargetCountOfMonth}>
                        </Route>
                        <Route path="common/:resourceId" getComponent={ getCommonContainer }>
                        </Route>
                    </Route>


                </Router>


            </MuiThemeProvider>
        </div>
    </Provider>,
    document.getElementById('root')
)



function getHomeContainer(location, callback) {

    callback(null, props => {
        return <Home {...props}/>
    })
}

/**
 * 通用页面组件
 * @param location
 * @param callback
 */
function getCommonContainer(location, callback) {

    callback(null, props => {
        return <CommonPage {...props}/>
    })
}