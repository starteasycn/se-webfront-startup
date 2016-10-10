/**
 * Created by wushang on 7/27/16.
 */
import { takeEvery } from 'redux-saga'
import { take, call, put, select, fork, cancel, race } from 'redux-saga/effects';

import loginSagas from './login'
import chartSagas from './charts'
import { fetchCommonPageData, fetchCommonDataByFilters } from '../services/api'

/**
 * 获取通用 页面结构数据
 * @param param
 */
function* reflushCommonPageData(param) {
    try {
        let commPageData = yield call(fetchCommonPageData, param.resourceId)
        yield put({type: 'request commonpage success', payload: commPageData})
        let refreshFn = param.refreshFn;
        //触发界面刷新
        refreshFn()
    } catch(e) {
        yield put({type: 'request commonpage failure'})
    }

}
function* watchReflushCommonPageData() {
    yield* takeEvery('REFLUSH_COMMONPAGE_ASYNC', reflushCommonPageData)
}

/**
 * 通过条件(filter,即通用界面上方的各种条件选框)获取通用界面的数据
 * 将界面上的所有异步请求收集,并统一触发,所有请求成功响应后,返回数据给reducer
 */
function* reflushCommonPageByFilter(action) {
    //显示 loading
    // yield put({type: 'loading content', payload: { isLoading: true }})
    try {
        console.time();
        console.log('start fetch...')
        var tasks = action.tasks.map(task => {
            return call(fetchCommonDataByFilters, action.filter, task)
        })
        let commonPageDataArr = yield tasks
        console.log('end fetch...', console.timeEnd())

        let commonPageData =
            _.chain().merge(...commonPageDataArr).reduce((result, curr, name, all) => {
                result[name] = curr
                return result;
            }, {}).value()
        yield put({type: 'reflush commonfilter success', payload: {commonPageData}})
    } catch(e) {
        yield put({type: 'reflush commonfilter failure'})
        throw e;
    } finally {
        //隐藏loading
        // yield put({type: 'loading content', payload: { isLoading: false }})
    }

}

function* watchReflushCommonPageByFilter() {
    yield* takeEvery('REFLUSH_COMMONDATA_ASYNC', reflushCommonPageByFilter)
}

export default function* root() {
    let allSaga = [].concat(loginSagas).concat(chartSagas).concat([watchReflushCommonPageData, watchReflushCommonPageByFilter])
    yield allSaga.map(sg => {return fork(sg)})
}

