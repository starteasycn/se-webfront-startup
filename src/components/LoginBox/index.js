/**
 * Created by iswear-batman on 2016/7/21.
 */
import {connect} from 'react-redux'
import {userLogin} from '../../actions/login'
import React, {Component} from 'react'
import loginBoxCss from './LoginBox.css'
import {md5,base64} from '../../tools'

/**
 * 登录框
 */
class LoginBox extends Component {
    constructor() {
        super();
        this.state = {
            username: 'weixiao_dap_dev',
            password: '123123',
            isRemember: false
        }
    }

    /**
     * 处理用户登录
     */
    handleLogin() {

        const {user, onUserLoginBtnClick} = this.props

        let username = this.state.username;
        let password = this.state.password;
        let isRemember = this.state.isRemember;

        var encryptPwd = md5.hex_md5(password).toLowerCase();

        var plainPassword = base64.base64_encode(password);

        var data = onUserLoginBtnClick({username, encryptPwd,plainPassword, isRemember});
    }
    onUsernameChanged(evt) {
        this.state.username = evt.currentTarget.value;
        this.setState(this.state)
    }
    onPasswordChanged(evt) {
        this.state.password = evt.currentTarget.value;
        this.setState(this.state)

    }
    onRememberChanged(evt) {
        this.state.isRemember = evt.currentTarget.value;
        this.setState(this.state)
    }
    render() {
        return (
            <div className="login-form">
                <form name="loginForm" method="post">
                    <h2 className="login-form-header text-left">用户登录</h2>
                    <div className="form-group login-input">
                        <div className="input-group input-group">
                                <span className="input-group-addon" id="userName">
                                    <i className="ib male"></i>
                                </span>
                            <input id="admin" type="text" autoFocus="true" className="form-control" placeholder="请输入账号"
                                   aria-describedby="sizing-addon1" required="" value={this.state.username} onChange={::this.onUsernameChanged}/>
                        </div>
                    </div>
                    <div className="form-group login-input">
                        <div className="input-group input-group">
                                <span className="input-group-addon" id="passWord">
                                    <i className="ib lock"></i>
                                </span>
                            <input type="password" id="wordpass" className="form-control" value={this.state.password}
                                   placeholder="请输入密码" aria-describedby="sizing-addon1" onChange={::this.onPasswordChanged}/>
                        </div>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value={this.state.isRemember} name="rememberMe" onChange={::this.onRememberChanged}/> 记住我
                        </label>
                    </div>
                    <button className="btn isbuttonlogin btn-lg btn-primary btn-block" onClick={::this.handleLogin}
                            type="button">
                        <span className="no-ng islogin">登录</span>
                        <i className="ib no-ng loading-icon loading-inverse hide"></i>
                    </button>
                </form>
            </div>
        )
    }
}

export default LoginBox;
