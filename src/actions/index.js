export const UPDATE_ROUTER_STATE = 'UPDATE_ROUTER_STATE'

import { createAction } from 'redux-actions'

import * as loginAction from './login'
import * as chartsAction from './charts'


module.exports = {
    ...loginAction,
    ...chartsAction
}
/**
 * 内容区"加载中"
 */
export const loadingContent = createAction('loading content')

/**
 * 获取通用页面的结构数据
 */
export const requestCommonPageSucc = createAction('request commonpage success')
export const requestCommonPageFail = createAction('request commonpage failure')

/**
 * 在通用页面点击上方条件控件时触发
 */
export const reflushCommonPageFilterSucc = createAction('reflush commonfilter success')
export const reflushCommonPageFilterFail = createAction('reflush commonfilter failure')