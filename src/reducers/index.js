import {routerReducer as routing} from 'react-router-redux'
import {combineReducers} from 'redux'
import { handleActions } from 'redux-actions'

import login from './login'
import charts from './charts'

/**
 * 通用Reducer
 */
var commonReducer = handleActions({
    /**
     * 通用页面结构数据获取成功
     * @param state
     * @param action
     * @returns {{}}
     */
    'request commonpage success' (state, action) {
        return {
            ...state,
            ...action.payload
        }
    },
    /**
     * 通用页面结构数据获取失败
     * @param state
     * @param action
     * @returns {{error: string}}
     */
    'request commonpage failure' (state, action) {
        return {
            ...state,
            error: '请求失败'
        }
    },
    /**
     * 通过参数(通用界面上方的各种查询条件)刷新界面数据成功
     * @param state
     * @param action
     * @returns {{}}
     */
    'reflush commonfilter success' (state, action) {
        return {
            ...state,
            ...action.payload
        }
    },
    /**
     * 通过参数(通用界面上方的各种查询条件)刷新界面数据失败
     * @param state
     * @param action
     * @returns {{error: string}}
     */
    'reflush commonfilter failure' (state, action) {
        console.error('获取数据失败')
        return {
            ...state,
            error: '获取数据失败'
        }
    }
}, {

})
/**
 * 获取通用界面结构数据
 * @param state
 * @returns {*|json.pages|{abc}|null}
 */
export function getCommonPagaData(state) {
    return state && state.pageData && state.pageData.page || null
}

/**
 * 获取界面数据(用于展示的图表、表格等...)
 * @param state
 * @returns {*|null}
 */
export function getCommonData(state) {
    return state && state.pageData && state.pageData.commonPageData || null
}


export default combineReducers({
    routing,
    login,
    charts,
    pageData: commonReducer
})