import {takeEvery} from 'redux-saga'
import {take, call, put, select, fork, cancel} from 'redux-saga/effects';
import 'whatwg-fetch'

import { fetchMenuData } from '../services/api'

/**
 *  login saga
 */
function delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}
export function* userLogin(param) {
    const {user} = param;
    var url = `http://uww-dev.thinkjoy.com.cn/v2/oauth/token?product=dap&grant_type=password&client_id=dap&client_secret=dap&scope=read&username=${user.username}&plainPassword=${user.plainPassword}&password=${user.encryptPwd}&`;

    var res = yield fetch(url);
    var userData = yield res.json();

    if (userData.rtnCode == "0000000") {
        console.log('登录成功>')

        // Step.1 保存user信息
        user.access_token = userData.bizData.value;
        yield put({type: 'user login success', payload: {user: user, info: '登录成功'}})

        // Step.2 获取目录信息
        yield call(getMenuData, false)

        //Step.3 页面跳转
        yield put({type: 'move to homepage', payload: {}})

    } else {
        yield put({type: 'user login failure', payload: {user: null, info: '操作失败'}})
    }
}

export function* watchUserLogin() {
    yield* takeEvery('USER_LOGIN_ASYNC', userLogin)
}

/**
 * 监听目录数据请求
 */
export function* getMenuData(useCache) {
    let menuData = null
    try{
        menuData = yield call(fetchMenuData, useCache)
        yield call(delay, 20)
        yield put({type: 'user menu success', payload: { menuData }})

    } catch (e){
        return yield put({type: 'user menu failure', payload: { menuData }})
    }
}
export function* watchFetchMenuInfo() {
    yield* takeEvery('USER_MENU_ASYNC', getMenuData)
}

module.exports = [ watchUserLogin, watchFetchMenuInfo]