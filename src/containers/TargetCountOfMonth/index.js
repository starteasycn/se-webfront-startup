/**
 * Created by wushang on 7/26/16.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import HomeSideBar from '../../components/HomeSideBar'
import HomeHeader from '../../components/HomeHeader'
import { getChartData, getChartsLoadingState } from '../../reducers/charts'
import { getMenuData } from '../../reducers/login'


import PageComponent from '../../components/PageTargetCountOfMonth'

/**
 * 月度目标统计
 */
class TargetCountOfMonth extends Component {
    constructor() {
        super()
    }


    render() {
        const { reflushChart, chartData, dispatch, isLoading} = this.props
        return (
            <div>
                <PageComponent
                    reflushChart={reflushChart}
                    chartData={chartData}
                    dispatch={dispatch}
                    isLoading={isLoading}
                />
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        chartData: getChartData(state),
        isLoading: getChartsLoadingState(state)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        /**
         *
         * @param countType 统计指标
         * @param countTime 时间  [0, 1, 2, 3]
         */
        reflushChart: (countType, countTime) => {
            //异步查询图表信息
            dispatch({type: 'reflush targetCountOfMonth request', param: {countType, countTime}})
        },
        dispatch
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TargetCountOfMonth)