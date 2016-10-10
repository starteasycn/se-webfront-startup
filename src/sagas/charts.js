/**
 * Created by wushang on 7/27/16.
 */
/**
 * 该saga文件中放置所有与图表交互相关的异步请求代码
 */
import {takeEvery} from 'redux-saga'
import {take, call, put, select, fork, cancel} from 'redux-saga/effects';
import { fetchTargetCountOfMonth } from '../services'

function* showLoading(isLoading) {
    yield put({type: 'loading content', payload: { isLoading: isLoading }})
}
/**
 *  echarts saga
 */
export function* reflushTargetCountOfMonth(data) {
    
    const {countType = 'sign', countTime = 1} = data.param;
    try {
        //显示 loading
        // yield call(showLoading, true)
        //yield put({type: 'loading content', payload: { isLoading: true }})
        //countType,countTime将参数传递给fetchTargetCountOfMonth,并yield一个Promise对象,等到promise resolve时接着往下执行
        let chartData = yield call(fetchTargetCountOfMonth, countType, countTime)
        yield put({type: 'reflush targetCountOfMonth chart success', payload: {chartData}});
    } catch(e) {
        yield put({type: 'reflush targetCountOfMonth chart failure', payload: {}});
    }
    // yield call(showLoading, false)
    //取消 loading
    //yield put({type: 'loading content', payload: { isLoading: false }})
}
export function* watchReflushTargetCountOfMonth() {
    yield* takeEvery('reflush targetCountOfMonth request', reflushTargetCountOfMonth)
}

module.exports = [watchReflushTargetCountOfMonth]