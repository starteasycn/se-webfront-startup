/**
 * Created by wushang on 7/27/16.
 */

import { handleActions } from 'redux-actions'

const initialState = {
    isLoading: false
}


/**
 * 获得图表数据
 * @param state
 * @returns {initialState.charts|{}|*}
 */
export function getChartData(state) {
    return state.charts && state.charts.chartData || {};
}

/**
 * 获取图表载入状态
 * @param state
 * @returns {*|boolean}
 */
export function getChartsLoadingState(state) {
    return state.charts && state.charts.isLoading
}
/**
 * 获得图表数据
 * @param state
 * @returns {initialState.charts|{}|*}
 */
export function getPageData(state) {
    return state.charts && state.charts.pageData || {};
}

export default handleActions({

    'reflush targetCountOfMonth chart' (state, action) {
        //state.user = null;
        return {
            ...state,
            ...action.payload
        }
    },
    /**
     * 成功获得 月度目标统计的图表数据
     * @param state
     * @param action
     * @returns {{}}
     */
    'reflush targetCountOfMonth chart success' (state, action) {
        return {
            ...state,
            ...action.payload
        }
    },
    'reflush targetCountOfMonth chart failure' (state, action) {
        return state
    },

    /**
     * 内容区在loading
     * @param state
     * @param action
     * @returns {{}}
     */
    'loading content' (state, action) {
        return {
            ...state,
            ...action.payload
        }
    }
}, initialState)
