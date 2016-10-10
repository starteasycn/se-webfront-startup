import React, {Component} from 'react'


//Material-ui
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {amber500} from 'material-ui/styles/colors';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import Snackbar from 'material-ui/Snackbar';

import {history} from '../../services'
import {style} from './style.css'

import { menuItem } from '../../services'

/**
 * 后台管理界面的左侧边栏
 */

/**
 * 菜单的配置数据
 * @type {{线下报表: {iconVDom: XML}, 月度目标统计: {route: string, iconVDom: XML}}}
 */
const MENU_CLASSNAME = {
    ContentInbox: <ContentInbox />,
    ActionGrade: <ActionGrade />
}

let SelectableList = MakeSelectable(List);

export default class HomeSideBar extends Component {
    constructor(param) {
        super(param)
        this.showSnackBar = this.showSnackBar.bind(this)
        this.state = {}
        this.state.index = null;
        this.state.snack = {
            open: false,
            message: ''
        }
    }
    componentWillReceiveProps() {
        this.setState(this.state)
    }

    /**
     * 处理左侧列表项的被点击事件
     */
    handleListClick(event, index) {
        menuItem(index)
        this.setState(this.state)
    }
    render() {
        let {menus, dispatch, isLoading, common,params} = this.props;

        //如果没有目录数据,则发送请求获取目录数据,并且停止渲染
        if (!menus || !menus.length) {
            dispatch({type: 'USER_MENU_ASYNC'})
            return null
        }
        let currentNavItem = Number(menuItem()) || null
        return (
            <div className="sider">
                <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                    <Drawer
                        open={true}
                        width={240}
                        containerClassName="dap-menu"
                        containerStyle={{paddingTop: '60px'}}>

                        <SelectableList
                            onChange={::this.handleListClick}
                            value={currentNavItem}>
                            {
                                menus.map((parentItem, parentInx) => {
                                    return (
                                        <ListItem
                                            key={'menu-' + parentInx}
                                            primaryText={parentItem.menuName}
                                            leftIcon={<ActionGrade />}
                                            initiallyOpen={false}
                                            primaryTogglesNestedList={true}
                                            value={parentItem.resourceID}
                                            nestedItems={
                                                parentItem.subMenu.map((childItem, childInx)=> {
                                                    // var childName = `menu-${parentInx}-${childInx}`
                                                    var childName = childItem.menuName;

                                                    var childObjUrl = "/home/common/"+childItem.resourceID;
                                                    return (
                                                        <ListItem
                                                            key={childItem.resourceID}
                                                            primaryText={childItem.menuName}
                                                            leftIcon={<ContentInbox />}
                                                            value={childItem.resourceID}
                                                            onClick={
                                                                () => {
                                                                    if (childObjUrl) {
                                                                        if (childObjUrl.indexOf('/common/') !== -1) {
                                                                        //通用页面
                                                                            var resourceId = childObjUrl.split('/').pop()
                                                                            dispatch({
                                                                                type: 'REFLUSH_COMMONPAGE_ASYNC',
                                                                                resourceId: resourceId,
                                                                                refreshFn: common.flitersChangeHandle
                                                                                })
                                                                        } else {
                                                                            dispatch({
                                                                                type: 'reflush targetCountOfMonth request',
                                                                                param: {}
                                                                            })
                                                                        }
                                                                        
                                                                         // this.context.router.push({
                                                                         //        pathname: childObjUrl
                                                                         //    });
                                                                        history.replaceState(null,childObjUrl)
                                                                    } else {
                                                                        console.log('no route bind')
                                                                    }
                                                                }}
                                                        />
                                                    )
                                                })
                                        }
                                        >

                                        </ListItem>
                                    )
                                })
                            }
                        </SelectableList>
                    </Drawer>
                </MuiThemeProvider>
                <Snackbar
                    open={this.state.snack.open}
                    message={this.state.snack.message}
                    autoHideDuration={4000}
                    onRequestClose={::this.handleRequestClose}
                />
            </div>
        )
    }

    handleRequestClose() {
        this.state.snack.open = false;
        this.setState(this.state)
    }

    /**
     * 显示下方弹出框
     * @param content
     */
    showSnackBar(message) {
        this.state.snack.open = true;
        this.state.snack.message = message;
        this.setState(this.state)
    }
}