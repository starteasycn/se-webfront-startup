/**
 * Created by wushang on 7/27/16.
 */

import React, {Component} from 'react'
import style from './style.css'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import echarts from 'echarts'

import { getChartOption } from '../../tools'

const countItems = [
    <MenuItem key={1} value="sign" primaryText="签约学校数"/>,
    <MenuItem key={2} value="verify" primaryText="认证学校数"/>,
    <MenuItem key={3} value="follower" primaryText="关注用户数"/>,
    <MenuItem key={4} value="active" primaryText="活跃用户数"/>
];
const timeItems = [
    <MenuItem key={1} value={0} primaryText="最近一周"/>,
    <MenuItem key={2} value={1} primaryText="最近二周"/>,
    <MenuItem key={3} value={2} primaryText="最近三周"/>,
    <MenuItem key={4} value={3} primaryText="最近四周"/>
];

export default class PageTargetCountOfMonth extends Component {
    /**
     * 修改统计指标时触发
     * @param event
     * @param index
     * @param value
     */
    changeCountType = (event, index, value) => {
        this.state.countItem.value = value;
        this.reflushChart();

    }

    /**
     * 修改时间选择框时触发
     * @param event
     * @param index
     * @param value
     */
    changeTimeType = (event, index, value) => {
        this.state.timeItem.value = value;
        this.reflushChart();
    }
    /**
     * 刷新图表组件
     */
    reflushChart = () => {

        const {timeItem, countItem} = this.state

        if (timeItem.value !== null && timeItem.value !== null) {
            this.props.reflushChart(countItem.value, timeItem.value);
        } else {
            console.log('请选择');
        }
        this.setState(this.state)
    }

    constructor() {
        super()
        this.changeTimeType = this.changeTimeType.bind(this)
        this.state = {}
        this.state.countItem = {value: 'sign'}
        this.state.timeItem = {value: 0}
    }
    componentWillMount() {

    }
    componentDidMount() {
        // setTimeout(() => {
        //     const { dispatch } = this.props
        //     dispatch({type: 'reflush targetCountOfMonth request', param: {}})
        // }, 1)
    }

    /**
     * Dom被渲染完成之后执行,操作DOM或者依赖DOM的行为都应该在该函数中执行
     */
    componentDidUpdate() {
        const { chartData } = this.props;

        if (chartData && chartData.bizData) {
            var chartDom = echarts.init(this.refs.chartWrap);
            var option = getChartOption(chartData)
            chartDom.setOption(option);
        }
    }
    /**
     * 使用数据刷新图表
     * @param chartData
     */
    render() {

        console.log('target component render...')
        const { isLoading } = this.props;
        var addon = null;
        if (isLoading) {
            addon = <CircularProgress />
        }
        return (
            <div className={'home-content ' + style.targetcountofmonth }>
                <div className={'content-line ' + style['content-top']}>
                    <SelectField
                        value={this.state.countItem.value}
                        onChange={this.changeCountType}
                        disabled={isLoading}
                        floatingLabelText="统计指标"
                    >
                        {countItems}
                    </SelectField>
                    <br />
                    <SelectField
                        value={this.state.timeItem.value}
                        onChange={this.changeTimeType}
                        disabled={isLoading}
                        floatingLabelText="选择时间"
                    >
                        {timeItems}
                    </SelectField>
                </div>
                { addon }
                <div id="chartWrap" ref="chartWrap" className={'chart' + (isLoading?' unvisible':'')}></div>
            </div>
        )

    }
}