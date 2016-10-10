/**
 * Created by wushang on 8/1/16.
 *
 * 通用页面
 */
import React, { Component } from 'react'
import { bindActionCreators, Link } from 'redux'
import { connect } from 'react-redux'

import HomeSideBar from '../../components/HomeSideBar'
import HomeHeader from '../../components/HomeHeader'
import CommonComponent from '../../components/CommonComponent'
import { getMenuData } from '../../reducers/login'
import { getCommonPagaData, getCommonData } from '../../reducers'
import { getChartsLoadingState } from '../../reducers/charts'
import { fetchMenuData } from '../../services'


class CommonPage extends Component {

    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        console.log('common mount')

        const { dispatch, params } = this.props
        //Step.1 从路由中得到页面名称
        //Step.2 根据页面名称得到页面元数据
        dispatch({type: 'REFLUSH_COMMONPAGE_ASYNC', resourceId: params.resourceId})
    }
    render() {
        const { dispatch, pageData, isLoading, commonData,params} = this.props
        if(!pageData) {
            return null;
        }
        return (
            <div>
                <CommonComponent
                    ref="common"
                    isLoading={isLoading}
                    sideBar={this.refs.sideBar}
                    dispatch={dispatch}
                    pageData={pageData}
                    commonData={commonData}
                />
            </div>
        )
        return (
            <section className="main-content">
                <HomeSideBar ref="sideBar"
                    menus={menuData && menuData.bizData.Menu || []}
                    dispatch={dispatch}
                    common={this.refs.common}
                    params={params}
                />
                <CommonComponent
                    ref="common"
                    isLoading={isLoading}
                    sideBar={this.refs.sideBar}
                    dispatch={dispatch}
                    pageData={pageData}
                    commonData={commonData}
                />
            </section>
        )
    }
}


function mapStateToProps(state) {
    return {
        isLoading: getChartsLoadingState(state),
        pageData: getCommonPagaData(state),
        commonData: getCommonData(state)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch),
        dispatch: dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommonPage)