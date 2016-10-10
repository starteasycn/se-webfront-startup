/**
 * Created by wushang on 7/27/16.
 */

import React, { Component } from 'react'
import style from './home-welcome.css'

export default class HomeWelcome extends Component {
    constructor() {
        super()
    }
    render() {
        return (
            <div className={"home-content " + style.welcome}>
                欢迎进入蜂巢数据服务管理后台
            </div>
        )
    }
}