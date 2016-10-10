
import React, { Component } from 'react'
import LoginFooterStyle from './LoginFooter.css'

class LoginFooter extends Component {
    constructor() {
        super()
    }

    render() {
        return (
            <footer className="login-footer">
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
        )
    }
}

module.exports = LoginFooter