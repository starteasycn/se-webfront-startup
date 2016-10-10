/**
 * Created by wushang on 7/25/16.
 */

import React, { Component } from 'react'

class LoginHeader extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <header className="login-header">
                <div className="row tb h100">
                    <div className="cell vm">
                        <a href="javascript:void(0);" className="ib logo-small vm"></a>
                    </div>
                </div>
                <div className="container h100">
                </div>
            </header>
        )
    }
}
module.exports = LoginHeader;