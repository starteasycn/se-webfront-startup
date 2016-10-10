import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {push} from 'react-router-redux';

import LoginHeader from '../../components/LoginHeader'
import LoginFooter from '../../components/LoginFooter'

import * as LoginActions from '../../actions/login'

import style from './style.css'
import LoginBox from '../../components/LoginBox'

class Login extends Component {
    constructor() {
        super()
    }

    render() {
        const {onUserLoginReq} = this.props
        return (
            <section className="main-content" style={{'background': '#2f4159'}}>
                <LoginHeader />
                <section className="login-content">
                    <div className="container">
                        <div className="row ">
                            <div className="bg-pic ib ">
                                <LoginBox
                                    onUserLoginBtnClick={onUserLoginReq}
                                />
                                <div className="bg-title"></div>
                            </div>
                            <div className="login-seq"></div>
                        </div>
                    </div>
                </section>
                <LoginFooter />
            </section>
        )
    }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        /**
         * 异步登录
         * @param user
         */
        onUserLoginReq: user => {
            dispatch({type: 'USER_LOGIN_ASYNC', user})
        },
        actions: bindActionCreators(LoginActions, dispatch),
        dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)
