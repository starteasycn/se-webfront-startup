/**
 * Created by wushang on 8/1/16.
 *
 * 通用组件,从后台获取页面元数据
 */

import React, {Component} from 'react'

import {Link} from 'react-router'
import SelectField from 'material-ui/SelectField';
import DownloadIcon from 'material-ui/svg-icons/action/get-app';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import echarts from 'echarts'
import _ from 'lodash'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import {fullWhite} from 'material-ui/styles/colors';



// import DropDownMenu from 'material-ui/DropDownMenu';
import DatePicker from 'material-ui/DatePicker';
import style from './style.css'

import {
    getChartOption,
    tool,
    getYearList,
    getMonthList,
    getDayList,
    getStartDateOfThisComponent,
    tabColorChange,
    getDateStr,
    getTable1Data,
    format,
    str2Date
} from '../../tools';


const filterBtnHoverColor = '#8eb0e4'

export default class CommonComponent extends Component {

    constructor(param) {
        super(param)
        this.state = {}
        this.state.filters = {}
        this.state.controlData = {}
        this.state.selectTarget = ""
        this.state.modalItems = ""
        this.state.targetDimension = ""
        this.state.targetDimensionOptions = <MenuItem value="" primaryText=""/>;
        this.state.isLoading = false
    }

    componentDidMount() {
        this.flitersChangeHandle()
    }

    componentWillReceiveProps() {
        this.state.resourceId = this.props.resourceId
        this.state.pageData = this.props.pageData
        this.state.sideBar = this.props.sideBar
        this.state.commonData = this.props.commonData
        this.setState(this.state)
    }

    /**
     * Dom被渲染完成之后执行,操作DOM或者依赖DOM的行为都应该在该函数中执行
     */
    componentDidUpdate() {
        // const { pageData, commonData} = this.props
        // _(pageData.pageFlow).forEach(flow => {
        //     if(flow.type === 'chart') {
        //         if (commonData && commonData[flow.chartNum]) {
        //             try {
        //                 var chartDom = echarts.init(document.getElementById(flow.name));
        //                 var option = getChartOption(commonData[flow.name])
        //                 chartDom.setOption(option);
        //             } catch (err) {
        //                 throw err
        //             }
        //
        //         }
        //     }
        //
        // })

    }


    handleTabChange = (id, tabId, tabIndex, pcontrol, chartId)=> {

        var data = this.getData();
        data.type = tabId;

        if (pcontrol > -1) {
            var flow = this.getChartById(pcontrol);
            if (pprikey[flow.chartNum]) {
                data = $.extend({}, data, pprikey[flow.chartNum]);
            }

        }

        tabColorChange(chartId, tabIndex);

        this.refreshChartData(id, data);
    }

    getChartById = (id)=> {
        const {dispatch, pageData} = this.props;
        var index = 0;
        for (var i = 0; i < pageData.pageFlow.length; i++) {
            var flow = pageData.pageFlow[i];
            if (flow.chartType == "chart"
                || flow.chartType == "bar"
                || flow.chartType == "line"
                || flow.chartType == "map"
                || flow.chartType == "newmap"
                || flow.chartType == "table"
                || flow.chartType == "stack"
                || flow.chartType == "stacked"
                || flow.chartType == "pie"
            ) {

                if (index == id) {
                    return flow;
                }
                index = index + 1;

            }

        }

    }

    refreshChartData = (id, data)=> {

        var chart = this.getChartById(id);
        var chartId = chart.chartNum + "" + chart.id;
        //Step.2 渲染后台数据
        if (chart.chartType == "chart" || chart.chartType != "") {
            echarts.init(document.getElementById(chartId)).showLoading({
                text: '数据加载中',
                effect: 'spin',
                textStyle: {
                    fontSize: 30
                }
            });
        }
        this.initChartData(chart, chartId, data);
    }

    /**
     * 当选框被选中时触发
     * @param evt
     * @param selCompName
     * @param value
     */
    handleSelectChange = (evt, selCompName, value) => {


        if (selCompName == "dateSelect") {
            let endTime = getDateStr(-1);
            let startTime = getDateStr(-parseInt(value));

            this.state.filters["startTime"] = {
                value: format(startTime)
            }

            this.state.filters["endTime"] = {
                value: format(endTime)
            }


        }

        this.state.filters[selCompName] = {
            value: value
        }
        this.flitersChangeHandle()
        this.setState(this.state)
    }


    handleDate2StartChange = (event, date) => {


        this.state.filters["startTime"] = {
            value: format(date)
        }
        this.setState(this.state)
    }


    handleDate2EndChange = (event, date) => {


        this.state.filters["endTime"] = {
            value: format(date)
        }
        this.setState(this.state)
    }


    handleDate1StartChange = (event, date) => {

        this.state.filters["time"] = {
            value: format(date)
        }
        this.setState(this.state)

    }


    /**
     * 当月份选框被选中时触发
     * @param evt
     * @param selCompName
     * @param value
     */
    handleDaySelectChange = (evt, selCompName, value) => {
        this.state.filters[selCompName] = {
            value: value
        }

        var yearCompName = "year_" + selCompName.split("_")[1];
        var yearValue = this.state.filters[yearCompName].value;

        var timeName = selCompName.split("_")[1];
        var timeValue = yearValue + '-' + value;

        this.state.filters[timeName] = {
            value: timeValue
        }
        this.flitersChangeHandle()
        this.setState(this.state)
    }

    /**
     * 当月份选框被选中时触发
     * @param evt
     * @param selCompName
     * @param value
     */
    handleMonthSelectChange = (evt, selCompName, value) => {
        this.state.filters[selCompName] = {
            value: value
        }


        var startDateOfThisComponent = getStartDateOfThisComponent();
        var dayCompName = "day_" + selCompName.split("_")[1];
        var yearCompName = "year_" + selCompName.split("_")[1];
        var yearValue = this.state.filters[yearCompName].value;
        var monthValue = this.state.filters[selCompName].value;
        var dayList = getDayList(yearValue, monthValue, startDateOfThisComponent);

        let dayitems = dayList.map((item, valueInx) => {

            return (
                <option key={`day_select_${valueInx}`} value={item.value}>{item.name}</option>
                // <MenuItem key={`day_select_${valueInx}`} value={item.value} primaryText={item.name}/>
            )
        })


        let dayvalue = dayList[dayList.length - 1].value;

        this.state.controlData[dayCompName] = {
            value: dayitems
        }

        this.state.filters[dayCompName] = {
            value: dayvalue
        }

        var timeName = selCompName.split("_")[1];
        var timeValue = yearValue + '-' + dayvalue;

        this.state.filters[timeName] = {
            value: timeValue
        }
        this.setState(this.state)
    }


    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };
    handleChange = (event, index, value) => {
        this.setState({modalSelectValue: value});
    };

    handleSubmit = () => {
        var targetUrl = "/fc/dap/hive/add/target";
        var request = {
            chartNum: 1,
            startTime: "2016-01-23",
            endTime: "2016-02-12",
            tagId: this.state.modalSelectValue
        }

        tool.ajaxAsyncGet(window.TARGETWEBSITE + targetUrl, request, function (result) {
        }, function (res) {
            commonJs.alertTop("坏的凭证", "error");
        });

        this.handleClose();
    };


    render() {
        const {sideBar, pageData, isLoading, commonData} = this.props;
        if (!pageData) {
            return null
        }
        //Step.1 如果有筛选条件,则渲染筛选条件
        let filters = null
        if (pageData.filter) {
            this.state.filters["resourceId"] = {
                value: pageData.resourceId
            }
            this.state.filters["reportId"] = {
                value: pageData.resourceId
            }
            this.state.filters["productCode"] = {
                value: "3"
            }
            filters = this.parseObjToFilters(pageData.filter, isLoading)
        }
        chartLists = pageData.pageFlow;
        //生成正文dom
        let flows = this.parseObjToFlow(pageData.pageFlow, isLoading, commonData)


        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="提交"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleSubmit}
            />,
        ];
        let btnStyle = {
            marginLeft: '5px',
            marginRight: '5px'
        }
        return (
            <div key="page_content" className="home-content">
                <div className="flow-content">
                    <div key="filters_content" className="dap-filters">
                        <div className="dap-filter-wrapper">
                            <h3 className={style['dap-page-title']}>
                                <span>运营周报</span>
                                <FontIcon
                                    className="material-icons"
                                    style={{color:'#a5c0ea'}}
                                >help</FontIcon></h3>
                            { filters }
                            <div className="filter-btngroup-wrapper">
                                <Divider
                                    style={{
                                        margin: '10px 20px 0 20px'
                                    }}
                                />
                                <div className="filter-btngroup">
                                    <FlatButton style={btnStyle} hoverColor={filterBtnHoverColor} label="整体指标展示" className="active" />
                                    <FlatButton style={btnStyle} hoverColor={filterBtnHoverColor} label="分渠道指标展现" />
                                    <FlatButton style={btnStyle} hoverColor={filterBtnHoverColor} label="自营渠道"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div key="flows_content" className="dap-flows">
                        { flows }
                    </div>

                    <div>
                        <Dialog
                            title="添加指标"
                            actions={actions}
                            modal={false}
                            open={this.state.open}
                            onRequestClose={this.handleClose}>

                            <SelectField value={this.state.modalSelectValue} onChange={this.handleChange}>
                                {this.state.modalItems}
                            </SelectField>

                        </Dialog>
                    </div>

                </div>
            </div>
        )
    }

    /**
     * 当渲染条件发生改变时触发(包含初始化)
     */
    flitersChangeHandle = () => {
        chartData = this.getData();
        const {dispatch, pageData} = this.props
        _(pageData.pageFlow).forEach(flow => {
            var chartId = flow.chartNum + "" + flow.id;
            switch (flow.chartType) {
                case 'tab':
                    tabColorChange(chartId, 0);
                    break;
                default:
                    break;
            }
        })


    }

    /**
     * 渲染对象为页面组件(在页面上从上往下排列)
     *
     * @param pageData
     * @param isLoading
     * @param commonData
     * @returns {Array}
     */
    parseObjToFlow = (pageFlow, isLoading, commonData) => {
        var data = this.getData();

        let flows = pageFlow.map((flow, inx) => {
            switch (flow.chartType) {
                case 'title':
                    return this.createTitle(flow, inx, isLoading)
                case 'tab':
                    return this.createTab(flow, this.handleTabChange)
                case 'table':
                case 'newmap':
                    return this.createTable(flow, inx, isLoading, data);
                case 'chart':
                case 'bar':
                case 'line':
                case 'stack':
                case 'stacked':
                case 'pie':
                    return this.createChart(flow, inx, isLoading, data);
                case 'table1':
                    return this.createTable1(flow, inx, isLoading, data);


                default:
                    console.error('unknow flow type>', flow.chartType)
                    return null;

            }

        })
        return flows;
    }

    createTitle = (flow, inx, isLoading) => {
        //title类型的chart不需要加入 加载列表
        return (
            <div className="chart_title">
                <p>{flow.value}</p>
            </div>
        )
    }


    createTab = (flow, handleTabChange) => {
        var chartId = flow.chartNum + "" + flow.id;
        var tab = JSON.parse(flow.value);
        var tabCssName = ["fistTabDiv", "otherTabDiv"];
        let tabs = _.map(tab.tabs, function (item, index) {
            var cssIndex = 0;
            if (index > 0) {
                cssIndex = 1;
            }

            var pcontrol = -1;
            if (tab.pcontrol)
                pcontrol = tab.pcontrol;

            var fun = tab.click + "('" + tab.cotrollers + "','" + item.id + "',this,'" + pcontrol + "')";
            var div = <div className={tabCssName[cssIndex]}
                           onClick={(evt, selInx, selValue) => {
                            handleTabChange(tab.cotrollers,item.id,index,pcontrol,chartId);
                            }
                            }>{item.name}</div>;
            return div
        });
        return (
            <div key={chartId} id={chartId} className="chartTab">
                {tabs}
            </div>
        )

    }

    createTable = (flow, inx, isLoading, data) => {
        var chartId = flow.chartNum + "" + flow.id;
        //Step.2 渲染后台数据
        this.initTableData(flow, chartId, data);
        var style = {width: '100%'}
        var divClass = ""
        if (flow.config) {

            var config = JSON.parse(flow.config);
            if (config.flowstyle) {
                style = config.flowstyle;
            }

            if (config.contentclass) {
                divClass = config.contentclass;
            }
        }
        return (
            <div key={chartId} className={`dap-flow ${divClass}`}>
                <div ref={chartId} id={chartId} style={style} className="flow_table_content"></div>
            </div>
        )
    }


    createTable1 = (flow, inx, isLoading, data) => {
        var chartId = flow.chartNum + "" + flow.id;
        //Step.2 渲染后台数据


        this.initTable1Data(flow, chartId, data, this.state.filters);
        let table1 = this.state.table1;
        return (
            <div key={chartId} ref={chartId} id={chartId} className="tableDiv1">
                {table1}
            </div>
        )

    }


    initTable1Data = (flow, chartId, data, filters)=> {

        data.chartNum = flow.chartNum;
        var response = null;
        tool.ajaxAsyncGet(window.TARGETWEBSITE + flow.url, data, function (result) {
            response = result;
        }, function (res) {
            commonJs.alertTop("坏的凭证", "error");
        });

        var option = this.getTable1Html(response, flow, data);

        this.state.table1 = option;

        if (response.bizData) {
            this.state.filters["userTarget"] = {
                value: response.bizData[0].keyName
            }

        }


    }


    getTable1Html = (response, flow, data) => {
        var rep = response.bizData;

        let tablesDataDiv = rep.map((item, valueInx) => {


            var deleteX = "";
            if (!item.isDefault) {
                deleteX = <b className='gaikuangTargetMinus' onClick={(value) =>{
                           this.deleteTarget(item.targetId);
                           }
                           }>X</b>;
            }
            var rateTmpNum = item.growthRate.replace("%", "");
            var growDesName = item.name == "关注用户" ? "" : "";

            var itemvalue = this.toThousands(item.value);
            var itemgrowthRate = this.setRate(item.growthRate);


            var selectClass = "";
            if (this.state.selectTarget == "") {
                if (valueInx == 0) {
                    selectClass = "gaikuangZhibiao select";
                } else {
                    selectClass = "gaikuangZhibiao";
                }

            } else {
                if (this.state.selectTarget == item.keyName) {
                    selectClass = "gaikuangZhibiao select";
                } else {
                    selectClass = "gaikuangZhibiao";
                }

            }

            var div = <div className={selectClass}
                           onClick={(value) =>{
                           this.clickTarget(item.keyName);
                           }
                           }>
                {deleteX}
                <div className='textaline'>
                    <div className='gaikuangNum'>{item.name}</div>

                    <div className='gaikuangNum'>
                        <table border='0' cellpadding='0' width='100%'>
                            <tr>
                                <td className='tdlabel'>昨日：</td>
                                <td className='tdvalue'>{itemvalue}</td>
                            </tr>

                            <tr>
                                <td className='tdlabel'>环比：</td>
                                <td className='tdvalue'>{growDesName}{itemgrowthRate}</td>
                            </tr>

                        </table>
                    </div>
                </div>
            </div>

            return div;
        })


        var addButton = this.dealButtonVisible();
        return (
            <div className="table1Style">{tablesDataDiv}{addButton}

            </div>
        )

    }


    dealButtonVisible = ()=> {
        var targetUrl = "/fc/dap/hive/all/target";
        var request = {
            chartNum: 1,
            startTime: "2016-01-23",
            endTime: "2016-02-12"
        }

        var response = "";
        tool.ajaxAsyncGet(window.TARGETWEBSITE + targetUrl, request, function (result) {
            response = result;
        }, function (res) {
            commonJs.alertTop("坏的凭证", "error");
        });

        if (response.bizData && response.bizData.length > 0) {
            return <div className='gaikuangZhibiao'>
                <p className='gaikuangAdd' onClick={() =>{
                           this.showAddModal();
                           }
                           }>+</p>
            </div>
        } else {
            return "";
        }

    }


    deleteTarget = (value)=> {
        console.log(value)
        var deleteUrl = "/fc/dap/hive/del/target";

        var request = {
            chartNum: 1,
            tagId: value
        }
        tool.ajaxAsyncGet(window.TARGETWEBSITE + deleteUrl, request, function (result) {
            response = result;
        }, function (res) {
            commonJs.alertTop("坏的凭证", "error");
        });

        this.setState(this.state)
    }


    showAddModal = ()=> {
        var targetUrl = "/fc/dap/hive/all/target";
        var request = {
            chartNum: 1,
            startTime: "2016-01-23",
            endTime: "2016-02-12"
        }

        var response = "";
        tool.ajaxAsyncGet(window.TARGETWEBSITE + targetUrl, request, function (result) {
            response = result;
        }, function (res) {
            commonJs.alertTop("坏的凭证", "error");
        });


        if (response.bizData && response.bizData.length > 0) {
            var modelDiv = response.bizData.map((item, valueInx) => {
                var menus = <MenuItem value={item.id} primaryText={item.targetName}/>;
                if (valueInx == 0) {
                    this.state.modalSelectValue = item.id
                }


                return menus;
            })
            this.state.modalItems = modelDiv;

            this.setState({open: true});
        }
    }


    clickTarget = (value)=> {

        this.state.filters["userTarget"] = {
            value: value
        }

        this.state.selectTarget = value;

        if (this.state.targetDimension != "") {
            var options = this.state.targetDimensionOptions;
            var targets = options.targets;
            var pos = 0;
            for (var i = 0; i < targets.length; i++) {
                if (targets[i] == value) {
                    pos = i;

                }
            }

            console.log(pos)

        }


        this.setState(this.state)


    }


    setRate = (value)=> {
        if (value == null || value == "") {
            return value;
        }

        if (value.indexOf("-") != -1) {
            return <span style={{'color': 'red'}}>{value}</span>;
        }
        else {
            return <span style={{'color': 'green'}}>{value}</span>;
        }

    }


    toPercent = (tableData, formatType, index) => {

        for (var rowIndex = 1; rowIndex < tableData.length; rowIndex++) {
            var value = parseFloat(tableData[rowIndex][index]);

            if ("percent" === formatType) {
                var num = new Number(value);
                num = num * 100
                tableData[rowIndex][index] = num.toFixed(2) + '%';
            }
        }
    }

    toThousands = (num) => {
        try {
            var param = num;
            var num;
            var suffix = '';
            var result = '';
            var decimalPart = '';

            //处理百分号
            if (num.toString().indexOf("%") >= 0) {
                suffix = '%';
                num = num.toString().substring(0, num.length - 1);
            } else {
                num = (num || 0).toString(), result = '';
            }

            if (isNaN(num)) {
                return param;
            }

            //处理小数
            if (num.toString().indexOf(".") >= 0) {
                decimalPart = num.toString().substring(num.toString().indexOf("."), num.toString().length);
                num = num.toString().substring(0, num.toString().indexOf("."));
            }

            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + decimalPart + suffix;
        } catch (e) {
            return num;
        }
    }

    getData = () => {
        let param = _.reduce(this.state.filters, function (result, next, name, obj) {
            result[name] = next.value
            return result
        }, {})
        return param;
    }

    createChart = (flow, inx, isLoading, data) => {
        var chartId = flow.chartNum + "" + flow.id;
        //Step.2 渲染后台数据

        var style = {height: '350px'}
        var divClass = ""
        var flowClass = "chart_back_default"
        var addTitle = false;
        if (flow.config) {
            var config = JSON.parse(flow.config);
            if (config.flowstyle) {
                style = config.flowstyle;
            }
            if (config.flowclass) {
                flowClass = config.flowclass;
            }

            if (config.contentclass) {
                divClass = config.contentclass;
            }
            if (config.addtitle) {
                addTitle = config.addtitle;
            }

        }
        this.initChartData(flow, chartId, data, addTitle);

        return (
            <div key={chartId} className={`dap-flow ${divClass}`}>
                <div className="flow_title" ref={`${chartId}_title`} id={`${chartId}_title`}></div>
                <div ref={chartId} id={chartId} style={style} className={flowClass}></div>
            </div>
        )
    }

    initChartData = (flow, chartId, data, addTitle)=> {
        data.chartNum = flow.chartNum;
        tool.ajaxGet(window.TARGETWEBSITE + flow.url, data, function (res) {
            try {
                var chartDom = echarts.init(document.getElementById(chartId));
                var option = getChartOption(res, flow)

                if (addTitle) {
                    var chartDomTitle = document.getElementById(chartId + "_title");
                    chartDomTitle.innerHTML = "<p><label>" + option.title.text + "</label></p>";
                    option.title.text = "";
                }
                chartDom.setOption(option);
            } catch (err) {
                throw err
            }
        }, function (res) {
            commonJs.alertTop("坏的凭证", "error");
        })
    }

    initTableData = (flow, chartId, data)=> {
        data.chartNum = flow.chartNum;
        tool.ajaxGet(window.TARGETWEBSITE + flow.url, data, function (res) {
            try {
                var chartDom = document.getElementById(chartId);
                var option = getChartOption(res, flow, data);
                // if (option) {
                //     $(chartDom).append(option.download);
                //     $(chartDom).append(option.table);
                // }
            } catch (err) {
                throw err
            }
        }, function (res) {
            commonJs.alertTop("坏的凭证", "error");
        })
    }
    /**
     * 渲染筛选条件
     */
    parseObjToFilters = (filters, isLoading) => {

        var _filters = filters.map((filter, inx) => {

            var rfilter = "";
            switch (filter.editorType) {
                case 'select':
                    rfilter = this.createSelect(filter, inx, isLoading);
                    break;
                case 'weixiao_week_cyc':
                    rfilter = this.createWeixiaoWeekCyc(filter, inx, isLoading);
                    break;
                case 'title':
                    rfilter = this.createTitle(filter, inx, isLoading);
                    break;
                case 'date2':
                    rfilter = this.createDate2(filter, inx, isLoading);
                case 'date3':
                    rfilter = this.createDate3(filter, inx, isLoading);
                    break;

                case 'date1':
                    rfilter = this.createDate1(filter, inx, isLoading);
                    break;

                case 'targetDimension':
                    rfilter = this.createTargetDimension(filter, inx, isLoading);
                    break;
                default:
                    rfilter = null;
                    break;
            }

            //这里处理filter的换行
            return rfilter;
            // return this.dealFilters(rfilter, inx, filter);


        })
        return this.dealFilters(_filters, filters);
        // return filters
    }

    dealFilters = (_filters, filters) => {
        var resultfiletersArray = [];
        var filetersArray = [];
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].lineBegin == 1 && i > 0) {
                resultfiletersArray.push(<div className="newline">{filetersArray}</div>)
                filetersArray = [];
                filetersArray.push(_filters[i])
            }
            else {
                filetersArray.push(_filters[i])
            }
        }
        resultfiletersArray.push(<div className="newline">{filetersArray}</div>);
        resultfiletersArray.push(<div className="endline"></div>);

        return resultfiletersArray;

    }


    /*******查询条件*************/
    //
    createSelect = (filter, inx, isLoading) => {

        //这里针对select的类型判断
        let items = filter.values.map((widget, valueInx) => {

            return (
                <MenuItem key={`select_${inx}_${valueInx}`} value={widget.value} primaryText={widget.name}/>
            )
        })
        let key = filter.name;
        let value = filter.values[0].value;

        if (typeof this.state.filters[key] !== 'undefined' && this.state.filters[key] !== null) {
            value = this.state.filters[key].value
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters[key] = {
                value: value
            }
        }
        return (
            <span className="condition_span">
            <SelectField
                key={ key }
                value={ value }
                disabled={isLoading}
                onChange={(evt, selInx, selValue) => {this.handleSelectChange(evt, filter.name, selValue)}}
                floatingLabelText={ filter.lable }>
                { items }
            </SelectField>
            </span>
        )

    }


    createDate3 = (filter, inx, isLoading) => {

        var endTime = getDateStr(-1);
        var startTime = getDateStr(-parseInt(filter.value));

        if (typeof this.state.filters["startTime"] !== 'undefined' && this.state.filters["startTime"] !== null) {
            startTime = this.state.filters["startTime"].value
            startTime = str2Date(startTime);
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters["startTime"] = {
                value: format(startTime)
            }
        }


        if (typeof this.state.filters["endTime"] !== 'undefined' && this.state.filters["endTime"] !== null) {
            endTime = this.state.filters["endTime"].value
            endTime = str2Date(endTime);
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters["endTime"] = {
                value: format(endTime)
            }
        }

        var lable = filter.lable;
        if (lable == "" || lable == null || typeof lable == "undefined") {
            lable = "日期选择";
        }

        return (
            <span className="condition_span">
            <label className="condition_date3_label">{lable}:</label>
            <DatePicker name="startTime" autoOk={true} value={startTime}
                        className="date3start"
                        onChange={this.handleDate2StartChange}

            />
            <label className="date3Lable">至</label>
            <DatePicker name="endTime" autoOk={true} value={endTime}
                        className="date3end"
                        onChange={this.handleDate2EndChange}
                        minDate={startTime}/>
           </span>
        )
    }

    createDate2 = (filter, inx, isLoading) => {

        var endTime = getDateStr(-1);
        var startTime = getDateStr(-parseInt(filter.value));

        if (typeof this.state.filters["startTime"] !== 'undefined' && this.state.filters["startTime"] !== null) {
            startTime = this.state.filters["startTime"].value
            startTime = str2Date(startTime);
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters["startTime"] = {
                value: format(startTime)
            }
        }


        if (typeof this.state.filters["endTime"] !== 'undefined' && this.state.filters["endTime"] !== null) {
            endTime = this.state.filters["endTime"].value
            endTime = str2Date(endTime);
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters["endTime"] = {
                value: format(endTime)
            }
        }

        return (
            <span className="condition_span">
            <DatePicker hintText="开始时间" name="startTime" autoOk={true} value={startTime}
                        style={{'display': 'inline-block', 'text-align': 'center'}}
                        onChange={this.handleDate2StartChange}
                        floatingLabelText=" "

            />
            <label style={{'margin': '0 10px'}}>至</label>
            <DatePicker hintText="结束时间" name="endTime" autoOk={true} value={endTime} style={{'display': 'inline-block'}}
                        onChange={this.handleDate2EndChange} minDate={startTime} floatingLabelText=" "/>

           </span>)

    }


    // createWeixiaoWeekCyc = (filter, inx, isLoading) => {
    //
    //
    //     var startDateOfThisComponent = getStartDateOfThisComponent();
    //     this.state.controlData[startDateOfThisComponent] = {
    //         value: startDateOfThisComponent
    //     }
    //     var yearList = getYearList(startDateOfThisComponent).reverse();
    //
    //     let yearkey = "year_" + filter.name;
    //     let yearvalue = yearList[0];
    //
    //     if (typeof this.state.filters[yearkey] !== 'undefined' && this.state.filters[yearkey] !== null) {
    //         yearvalue = this.state.filters[yearkey].value
    //     } else {
    //         //如果值不存在,则对select赋予初始值
    //         this.state.filters[yearkey] = {
    //             value: yearvalue
    //         }
    //     }
    //
    //     let yearitems = yearList.map((item, valueInx) => {
    //
    //         return (
    //             <MenuItem key={`year_select__${valueInx}`} value={item} primaryText={`${item}年`}/>
    //         )
    //     })
    //     this.state.controlData[yearkey] = {
    //         value: yearitems
    //     }
    //
    //     var monthList = getMonthList(yearvalue, startDateOfThisComponent);
    //     let monthitems = monthList.map((item, valueInx) => {
    //
    //         return (
    //             <MenuItem key={`month_select_${valueInx}`} value={item} primaryText={`${item}月`}/>
    //         )
    //     })
    //
    //     let monthkey = "month_" + filter.name;
    //     let monthvalue = monthList[monthList.length - 1];
    //
    //     this.state.controlData[monthkey] = {
    //         value: monthitems
    //     }
    //
    //     if (typeof this.state.filters[monthkey] !== 'undefined' && this.state.filters[monthkey] !== null) {
    //         monthvalue = this.state.filters[monthkey].value
    //     } else {
    //         //如果值不存在,则对select赋予初始值
    //         this.state.filters[monthkey] = {
    //             value: monthvalue
    //         }
    //     }
    //
    //
    //     var dayList = getDayList(yearvalue, monthvalue, startDateOfThisComponent);
    //
    //     let dayitems = dayList.map((item, valueInx) => {
    //
    //         return (
    //             <MenuItem key={`day_select_${inx}_${valueInx}`} value={item.value} primaryText={item.name}/>
    //         )
    //     })
    //
    //     let daykey = "day_" + filter.name;
    //     let dayvalue = dayList[dayList.length - 1].value;
    //
    //     if (typeof this.state.filters[daykey] !== 'undefined' && this.state.filters[daykey] !== null) {
    //         dayvalue = this.state.filters[daykey].value
    //     } else {
    //         //如果值不存在,则对select赋予初始值
    //         this.state.filters[daykey] = {
    //             value: dayvalue
    //         }
    //     }
    //
    //     this.state.controlData[daykey] = {
    //         value: dayitems
    //     }
    //     let key = filter.name;
    //     let value = yearvalue + '-' + dayvalue;
    //     if (typeof this.state.filters[key] !== 'undefined' && this.state.filters[key] !== null) {
    //         value = this.state.filters[key].value
    //     } else {
    //         //如果值不存在,则对select赋予初始值
    //         this.state.filters[key] = {
    //             value: value
    //         }
    //     }
    //
    //     //
    //     return (
    //         <div className={`condition_select${filter.classType}`}>
    //             <input value={value} key={key} type="hidden"/>
    //             <SelectField
    //                 key={ yearkey }
    //                 value={ yearvalue}
    //                 disabled={isLoading}
    //                 onChange={(evt, selInx, selValue) => {this.handleYearSelectChange(evt, yearkey, selValue)}}
    //                 floatingLabelText='年'
    //             >
    //                 { this.state.controlData[yearkey].value }
    //             </SelectField>
    //             <SelectField
    //                 key={ monthkey }
    //                 value={ monthvalue }
    //                 disabled={isLoading}
    //                 onChange={(evt, selInx, selValue) => {this.handleMonthSelectChange(evt, monthkey, selValue)}}
    //                 floatingLabelText='月'
    //             >
    //                 { this.state.controlData[monthkey].value }
    //             </SelectField>
    //             <SelectField
    //                 key={ daykey }
    //                 value={ dayvalue }
    //                 disabled={isLoading}
    //                 onChange={(evt, selInx, selValue) => {this.handleDaySelectChange(evt, daykey, selValue)}}
    //                 floatingLabelText='日'
    //             >
    //                 { this.state.controlData[daykey].value }
    //             </SelectField>
    //         </div>
    //     )
    // }


    createWeixiaoWeekCyc = (filter, inx, isLoading) => {


        var startDateOfThisComponent = getStartDateOfThisComponent();
        this.state.controlData[startDateOfThisComponent] = {
            value: startDateOfThisComponent
        }
        var yearList = getYearList(startDateOfThisComponent).reverse();

        let yearkey = "year_" + filter.name;
        let yearvalue = yearList[0];

        if (typeof this.state.filters[yearkey] !== 'undefined' && this.state.filters[yearkey] !== null) {
            yearvalue = this.state.filters[yearkey].value
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters[yearkey] = {
                value: yearvalue
            }
        }

        let yearitems = yearList.map((item, valueInx) => {

            return (
                <option key={`year_select_${valueInx}`} value={item}>{`${item}年`}</option>
            )
        })
        this.state.controlData[yearkey] = {
            value: yearitems
        }

        var monthList = getMonthList(yearvalue, startDateOfThisComponent);
        var dayList = getDayList(yearvalue, monthvalue, startDateOfThisComponent);
        if (dayList.length == 0) {
            monthList = monthList.splice(monthList - 1, 1);
        }
        let monthitems = monthList.map((item, valueInx) => {

            return (
                <option key={`month_select_${valueInx}`} value={item}>{`${item}月`}</option>
            )
        })

        let monthkey = "month_" + filter.name;
        let monthvalue = monthList[monthList.length - 1];

        this.state.controlData[monthkey] = {
            value: monthitems
        }

        if (typeof this.state.filters[monthkey] !== 'undefined' && this.state.filters[monthkey] !== null) {
            monthvalue = this.state.filters[monthkey].value
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters[monthkey] = {
                value: monthvalue
            }
        }

        dayList = getDayList(yearvalue, monthvalue, startDateOfThisComponent);


        let dayitems = dayList.map((item, valueInx) => {

            return (
                <option key={`day_select_${valueInx}`} value={item.value}>{item.name}</option>
            )
        })

        let daykey = "day_" + filter.name;

        let dayvalue = dayList[dayList.length - 1].value;

        if (typeof this.state.filters[daykey] !== 'undefined' && this.state.filters[daykey] !== null) {
            dayvalue = this.state.filters[daykey].value
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters[daykey] = {
                value: dayvalue
            }
        }

        this.state.controlData[daykey] = {
            value: dayitems
        }
        let key = filter.name;
        let value = yearvalue + '-' + dayvalue;
        if (typeof this.state.filters[key] !== 'undefined' && this.state.filters[key] !== null) {
            value = this.state.filters[key].value
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters[key] = {
                value: value
            }
        }
        //
        return (
            <div className={`condition_row ${filter.classType}`}>
                <input value={value} key={key} type="hidden"/>
                <label className="condition_label">{filter.lable}:</label>
                <select key={ yearkey } value={ yearvalue} className="condition_select width90"
                        onChange={(evt, selInx, selValue) => {
                        this.handleYearSelectChange(evt, yearkey, evt.target.value)
                    }}>
                    { this.state.controlData[yearkey].value }
                </select>

                <select key={ monthkey } value={ monthvalue} className="condition_select width90"
                        onChange={(evt, selInx, selValue) => {
                        this.handleMonthSelectChange(evt, monthkey, evt.target.value)
                    }}>

                    { this.state.controlData[monthkey].value }
                </select>

                <select key={ daykey } value={ dayvalue} className="condition_select"
                        onChange={(evt, selInx, selValue) => {
                        this.handleDaySelectChange(evt, daykey, evt.target.value)
                    }}>

                    { this.state.controlData[daykey].value }
                </select>
            </div>
        )
    }


    createDate1 = (filter, inx, isLoading)=> {
        var time = getDateStr(-1);

        if (typeof this.state.filters["time"] !== 'undefined' && this.state.filters["time"] !== null) {
            time = this.state.filters["time"].value
            time = str2Date(time);
        } else {
            //如果值不存在,则对select赋予初始值
            this.state.filters["time"] = {
                value: format(time)
            }
        }

        return (
            <span className="condition_span">
            <label className="condition_date1_label">{filter.lable}:</label>
            <DatePicker name="time" autoOk={true} value={time}
                        className=""
                        onChange={this.handleDate1StartChange}

            />
           </span>
        )


    }


    createTargetDimension = (filter, inx, isLoading)=> {

        this.state.targetDimension = filter.value;
        return (
            <span className="condition_span">
            <SelectField
                key={filter.name}
                value=""
                disabled={isLoading}
                onChange={(evt, selInx, selValue) => {this.handleTargetDimensionChange(evt, filter.name, selValue)}}
                floatingLabelText={filter.lable } id="targetDimension">

                {this.state.targetDimensionOptions}
            </SelectField>
            </span>
        )


    }

    handleTargetDimensionChange = (evt, name, selValue)=> {

    }
}


//
//
// if (flow.chartType === 'chart') {
//
// } else if (flow.chartType === 'download') {
//     //渲染下载按钮
//
//     //Step.1 整理当前的数据对象 {param1: {value: 1}} => {param1: 1}
//     let url = null
//     let currentFilters = _.reduce(this.state.filters, function(result, next, name, obj){
//         result[name] = next.value
//         return result
//     }, {})
//
//     //Step.2 将当前的参数状态插入模板中
//     let ds = pageData.dataSource.filter(ds => {return ds.name === flow.dataSource})
//     if (ds.length === 0) {
//         throw new Error(`dataSource配置异常,无法找到name=${flow.dataSource}的url`)
//     }
//     url = tool.tmplFn(ds[0].url, currentFilters)
//
//     //Step.3 将生成好的url插入到按钮中
//     return (
//         <div key={`flow_${inx}`} className="dap-flow flow-download">
//             <RaisedButton
//                 ref={flow.name}
//                 href={url}
//                 target="_blank"
//                 disabled={isLoading}
//                 label={flow.title}
//                 icon={<DownloadIcon />}
//             />
//         </div>
//     )
// } else if (flow.chartType === 'table') {
//
//
// } else {
//     console.error('unknow flow type>', flow.chartType)
// }

// class NewComponent extends React.Component {
//     constructor() {
//         super();
//         this.state = {};
//     }
//     render() {
//         return (
//             <div>
//                 <Dialog
//                     title="添加指标"
//                     actions={actions}
//                     modal={false}
//                     open={this.state.open}
//                     onRequestClose={this.handleClose}>
//
//                     <SelectField value={this.state.modalSelectValue} onChange={this.handleChange}>
//                         {this.props.name}
//                         {this.state.modalItems}
//                     </SelectField>
//
//                 </Dialog>
//                 <button onClick={this.props.onChange}>Click</button>
//                 <button onCLick={() => {this.setState(this.state)}}></button>
//             </div>
//         )
//     }
// }