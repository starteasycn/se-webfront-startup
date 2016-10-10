/**
 * Created by iswear-batman on 2016/7/21.
 */
import { connect } from 'react-redux'
import { userLogin } from '../../actions/login'
import React, { Component } from 'react'
import Tool from '../../services/Tool'

import '../../Style/login/login.css'; //加载公共样式
/**
 * 登录框
 */
class AppBox extends Component {
    constructor() {
        super();
        this.state = {
            button: '登录'
        };
        this.signin = () => {
            var username = this.refs.username.value;
            if (!username) return alert('用户名不能为空！');
            var password = this.refs.password.value;
            if (!username) return alert('用户名不能为空！');

            var rememberMe = this.refs.rememberMe.value;

            var encryptPwd = hex_md5(password).toLowerCase();

            var plainPassword = base64_encode(password);
            this.setState({ button: '登录中...' });
            var data = {
                "product": "dap",
                "grant_type": "password",
                "client_id": "dap",
                "client_secret": "dap",
                "scope": "read",
                "username": username,
                "plainPassword": plainPassword,
                "password": encryptPwd
            };


            Tool.get('/v2/oauth/token', data, (res) => {
                var access_token = res.bizData.value;
                Tool.setCookie("access_token", access_token);
                var user = {};
                user.username=username;
                user.access_token = access_token;
                this.props.signinSuccess(user);
                this.context.router.push({
                    pathname: '/home'
                });

            }, () => {
                alert('登录失败！');
                this.setState({ button: '登录' });
            },true);
        }
    }

    /**
     * 处理用户登录
     */
    handleLogin() {

        const { user, onUserLoginBtnClick} = this.props

        var username = this.refs.username.value;
        if (!username) return alert('用户名不能为空！');
        var password = this.refs.password.value;
        if (!username) return alert('用户名不能为空！');

        let isRemember = $(this.refs.remember).is(':checked');

        var encryptPwd = hex_md5(password).toLowerCase();

        var plainPassword = base64_encode(password);

        var data = {
            "product": "dap",
            "grant_type": "password",
            "client_id": "dap",
            "client_secret": "dap",
            "scope": "read",
            "username": username,
            "plainPassword": plainPassword,
            "password": encryptPwd
        };

        var setting = {
            url: 'v2/oauth/token', //默认ajax请求地址
            type: 'GET', //请求的方式
            data: data, //发给服务器的数据
            success:  function () { }, //请求成功执行方法
            error:  function () { } //请求失败执行方法
        };

        onUserLoginBtnClick(setting,true);
    }
    render() {
        return (
            <div>
                <header className="login-header">
                    <div className="row tb h100">
                        <div className="cell vm">
                            <a href="javascript:void(0);" className="ib logo-small vm"></a>
                        </div>
                    </div>
                    <div className="container h100">
                    </div>
                </header>


                <section className="login-content" data-flex="dir:top main:center cross:center">

                    <div className="container">

                        <div className="bg-pic ib " data-flex="dir:top main:center cross:center">
                            <div className="login-form">
                                <h2 className="login-form-header text-left">用户登录</h2>
                                <div className="form-group login-input">
                                    <div className="input-group">
                                                <span className="input-group-addon" id="userName">
                                                    <i className="ib male"></i>
                                                </span>
                                        <input ref="username" type="text" value="weixiao_dap_dev" placeholder="请输入账号" className="form-control "/>
                                    </div>
                                </div>

                                <div className="form-group login-input">
                                    <div className="input-group input-group">
                                                <span className="input-group-addon" id="passWord">
                                                    <i className="ib lock"></i>
                                                </span>
                                        <input ref="password" type="password" value="123123" placeholder="请输入密码" className="form-control "/>
                                    </div>
                                </div>

                                <div className="checkbox">
                                    <label>
                                        <input ref="rememberMe" type="checkbox" placeholder="请输入密码" /><span  className="checkboxLabel" data-flex-box="0">记住我</span>

                                    </label>
                                </div>
                                <button className="btn isbuttonlogin btn-lg btn-primary btn-block" onClick={::this.handleLogin}>{this.state.button}</button>

                            </div>
                            <div className="bg-title"></div>
                        </div>
                        <div className="login-seq"></div>

                    </div>
                </section>




                <footer className="login-footer " >
                    <div className="text-center">
                        <ul className="footer-list">
                            <li>
                                <a href="javascript:void(0)">关于我们</a>
                            </li>
                            <li>
                                <a href="javascript:void(0)">联系电话：13759904424</a>
                            </li>
                            <li>
                                <a href="mailto:honeycomb@thinkjoy.cn">邮箱：honeycomb@thinkjoy.cn</a>
                            </li>
                            <li>
                                <a href="javascript:void(0)" className="end">Copyright@2015 all rights reserved</a>
                            </li>
                        </ul>
                    </div>

                </footer>
            </div>
        )
    }
}

export default AppBox;
