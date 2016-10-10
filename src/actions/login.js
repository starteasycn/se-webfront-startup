import { createAction } from 'redux-actions'

// export const userLogin = createAction('user login')
export const userLoginFailure = createAction('user login failure')
export const userLoginSuccess = createAction('user login success')

export const moveToHomePage = createAction('move to homepage')

export const menuInfoFailure = createAction('menu info failure')
export const menuInfoSuccess = createAction('menu info success')