import { Router, Route, browserHistory, hashHistory } from 'react-router'
import * as api from './api'
import * as other from './other'

// export const history = browserHistory
export const history = hashHistory
module.exports = {
    ...api, history, ...other
}
