/**
 * Created by wushang on 7/26/16.
 */

import React, {Component} from 'react'

import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover';
import {red500, yellow500, blue500, blue50} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

import {cookie,tool} from '../../tools'
import {history} from '../../services'
import style from './style.css'

export default class HomeHeader extends Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.state.popMenu = {}
        this.state.popMenu.isOpen = false
        this.state.popMenu.anchorEl = null;
    }

    /**
     * 弹出目录显示
     * @param event
     */
    handleTouchTap = (event) => {
        // This prevents ghost click.
        event.preventDefault();
        this.state.popMenu.isOpen = true;
        this.state.popMenu.anchorEl = event.currentTarget
        this.setState(this.state);
    };

    /**
     * 登出系统
     * @param event
     */
    handleLogout = (event) => {
        var cookieStr = document.cookie;
        var keysValue = cookieStr.split(";");
        var token;
        for (var s = 0, len = keysValue.length; s < len; s++) {
            if (keysValue[s].indexOf("access_token") > -1) {
                token = keysValue[s].split("=")[1];
            }
        }
        token = token || "";

        tool.ajaxPost(window.LOGOUT + token, null, function (res) {
            try {
                history.push("/login")
            } catch (err) {
                throw err
            }
        }, function (res) {
            console.log("登出失败.", res);
        }, false)
    };


    /**
     * 弹出目录隐藏
     */
    handleRequestClose = () => {
        this.state.popMenu.isOpen = false;
        this.setState(this.state);
    };

    render() {
        let userName =  cookie.getCookie('registerAccount');
        return (
            <div className={style['dap-header']}>
                    <Toolbar
                        style={{background: 'none'}}
                        className="daphome-header">
                        <img id="logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAAAfCAYAAACiT0BMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIwQTA2RTE0NkU3NzExRTZCMDI2OEM4OEQwNzQ1MDIwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIwQTA2RTE1NkU3NzExRTZCMDI2OEM4OEQwNzQ1MDIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjBBMDZFMTI2RTc3MTFFNkIwMjY4Qzg4RDA3NDUwMjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjBBMDZFMTM2RTc3MTFFNkIwMjY4Qzg4RDA3NDUwMjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Nc3MzAAAHa0lEQVR42tya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" alt="蜂巢" />
                        <ToolbarGroup>
                            <ListItem
                                disabled={true}
                                ref="popMenu"
                                leftAvatar={
                                    <Avatar
                                     src="/asserts/imgs/head-default.png"
                                     className={style['avatar-icon']}
                                     />
                                }
                                onClick={this.handleTouchTap}
                                style={{color: 'white'}}
                            >
                                weixiao_dap
                            </ListItem>
                            <ToolbarSeparator
                                style={{backgroundColor: 'rgba(255,255,255,.6)'}}
                            />
                            <ListItem
                                onClick={() => {console.log('exit')}}
                            >
                                <FontIcon
                                    className="material-icons"
                                    color={blue50}
                                >exit_to_app</FontIcon>

                            </ListItem>
                        </ToolbarGroup>
                    </Toolbar>
            </div>
        )
        
    }
}