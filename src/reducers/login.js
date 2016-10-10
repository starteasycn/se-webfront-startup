import {handleActions} from 'redux-actions'
import {UPDATE_ROUTER_STATE} from '../actions'
import { history, fetchMenuData } from '../services'
import { cookie } from '../tools'
import _ from 'lodash'

const initialState = {
    user: null,
    menuData: null
}
export default handleActions({
    'user login failure' (state, action) {
        console.log('[reducer] login failure')
        alert(action.payload.info);
        state.user = null;
        return {
            ...state,
            user: {...action.payload.user}
        };
    },
    'user login success' (state, action) {

        console.log('[reducer] login success')
        cookie.setCookie('access_token', action.payload.user.access_token);
        cookie.setCookie('registerAccount', action.payload.user.username);


        return { ...state, user: {...action.payload}}
    },
    'user menu success' (state, action) {
        console.log('[reducer] menu success')

        //return _.assign(state, {menuData: action.payload})

        return {
            ...state,
            menuData: action.payload.menuData
        }
    },
    'move to homepage' (state, action) {
        console.log('[reducer] move to homepage')
        setTimeout(() => {
            history.push('/home')
        }, 10)
        return state
    },
    'user menu failure' (state, action) {
        alert('获取目录数据失败')
        return state;
    }
}, initialState)

export function getMenuData(state) { 
    return state.login.menuData
}
