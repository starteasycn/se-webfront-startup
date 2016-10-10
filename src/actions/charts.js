/**
 * Created by wushang on 7/27/16.
 */
import { createAction } from 'redux-actions'

/**
 * 刷新月度目标统计图表
 */
export const reflushTargetCountOfMonth = createAction('reflush targetCountOfMonth chart')
export const reflushTargetCountOfMonthSuccess = createAction('reflush targetCountOfMonth chart success')
export const reflushTargetCountOfMonthFailure = createAction('reflush targetCountOfMonth chart failure')

export const getMenu = createAction('reflush targetCountOfMenu chart')
export const getMenuSuccess = createAction('reflush targetCountOfmenu chart success')
export const getMenuFailure = createAction('reflush targetCountOfMonth chart failure')


export const getPage = createAction('reflush targetCountOfPage chart')
export const getPageSuccess = createAction('reflush targetCountOfPage chart success')
export const getPageFailure = createAction('reflush targetCountOfPage chart failure')
