/**
 * Created by wushang on 8/12/16.
 *
 * 后台页面的主路由,位于所有后台子页面的 父/祖先
 */
import React, { Component } from 'react';
import { bindActionCreators, Link } from 'redux'
import _ from 'lodash'
import { connect } from 'react-redux'

import HomeHeader from '../../components/HomeHeader'
import HomeSideBar from '../../components/HomeSideBar'

import { getChartsLoadingState } from '../../reducers/charts'
import { getMenuData } from '../../reducers/login'
import { getCommonPagaData, getCommonData } from '../../reducers'

class Home extends Component {
    constructor(props, context) {
        super(props, context)
    }
    componentDidMount() {
        console.log('home mount')
    }

    render() {
        const { dispatch, menuData, pageData, isLoading, commonData, common} = this.props
        return (
            <section className="main-content">
                <HomeHeader />
                <HomeSideBar
                    menus={menuData && menuData.bizData.Menu || []}
                    dispatch={dispatch}
                    common={{flitersChangeHandle: () =>{}}}
                />
                { this.props.children }
            </section>
        )
    }
}
function mapStateToProps(state) {
    return {
        isLoading: getChartsLoadingState(state),
        menuData: getMenuData(state)
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
)(Home)