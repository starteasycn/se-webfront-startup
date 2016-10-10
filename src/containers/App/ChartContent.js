import React, {Component, PropTypes} from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';

import {ChatController} from '../controller/ChatController';


/**
 * (导航分类)
 *
 * @class Nav
 * @extends {Component}
 */
export class ChartContent extends Component {
    render() {
        let {id,data} = this.props;

        data = {"bizData":{"condition":[{"classType":"","domType":"select","editorType":"select","lable":"统计指标","lineBegin":1,"name":"statisticsTarget","priority":1,"valueType":1,"values":[{"defaultCheck":0,"name":"签约学校数","value":"sign"},{"defaultCheck":0,"name":"认证学校数","value":"verify"},{"defaultCheck":0,"name":"关注用户数","value":"follower"},{"defaultCheck":0,"name":"活跃用户数","value":"active"}]},{"classType":"","domType":"select","editorType":"select","lable":"时间选择","lineBegin":1,"name":"weekSelect","priority":4,"valueType":1,"values":[{"defaultCheck":0,"name":"最近一周","value":"0"},{"defaultCheck":0,"name":"最近两周","value":"1"},{"defaultCheck":0,"name":"最近三周","value":"2"},{"defaultCheck":0,"name":"最近四周","value":"3"}]}],"reportConfigs":[{"chartNum":1,"chartType":"chart","downAble":0,"id":24,"url":"/fc/dap/hive/web/chart"}]},"rtnCode":"0000000","ts":1468997539581};
        
        var condition = null ;
        var reportConfigs = null;
        if(data){
            condition = data.bizData.condition;
            reportConfigs = data.bizData.reportConfigs;
        }
        var searchBar = null;
        if(condition){
            searchBar = condition.map((item, index) => {
                return <SearchController searchitem={item} />
            });

        }

        var chartBar = null;

        if(reportConfigs){
            chartBar = reportConfigs.map((item, index) => {
                return <Chart chartcondition={item} />
            });

        }
        return (
            <div className="testFont">
                {
                    searchBar
                }
                {
                    chartBar
                }

            </div>
        );
    }
}



/**
 * (导航分类)
 *
 * @class Nav
 * @extends {Component}
 */
class SearchController extends Component {
    render() {
        let {searchitem} = this.props;
        var form_control =  null;
        console.log(searchitem.domType);
        if(searchitem.domType=="select"){
            form_control = <SelectControl select={searchitem}/>
        }
        else {
            form_control = "hello world"
        }
        return (
            <div>{form_control}</div>
        );
    }
}

/**
 * (导航分类)
 *
 * @class Nav
 * @extends {Component}
 */
class Chart extends Component {
    render() {
        let {chartcondition} = this.props;
        var form_control =  null;
        var className = "";
        var id =  chartcondition.chartNum + "" + chartcondition.id;
        var res = {"bizData":{"legend":["目标值","新增值","完成率"],"xData":["2016-06-09"],"yData":{"完成率":["46.32"],"新增值":["1094"],"目标值":["2361"]},"units":["{\"unit\":\"所\""," \"num\": 2","\"unit1\":\"%\"}\n"],"title":"签约学校统计"},"rtnCode":"0000000","ts":1469093076784};

        var chartData = res.bizData;
        if(chartcondition.chartType=="chart" ||
            chartcondition.chartType=="line" ||
            chartcondition.chartType=="stacked"
        ){
            className = "chartDiv";
            form_control = <ChatController chartData={chartData}     bgcolor="#f8f8f8" />
        }

        return (
            <div className={className} >{form_control}</div>
        );
    }
}


/**
 * (下拉选择框)
 *
 * @class SelectControl
 * @extends {Component}
 */
class SelectControl extends Component {
    render() {
        let {select} = this.props;

        console.log("hello in");

        var label = "";
        if (select.lable) {
            label = <SpanControl className="condition_select_label" text={select.lable}/>
        }

        return (
            <div className={`condition_select{select.classType}`} >
                {label}
                <select className="condition_select_select" name={select.name} >

                    {
                        select.values.map((item, index) => {
                            return <option value={item.value} >{item.name} </option>
                        })
                    }
                </select>
            </div>


        );
    }
}

class SpanControl extends Component {
    render() {
        let {className,text} = this.props;
        return (
            <span className={className}>{text}</span>

        );
    }
}


/**
 * (下拉选择框)
 *
 * @class RadioControl
 * @extends {Component}
 */
class RadioControl extends Component {
    render() {
        let {radio} = this.props;

        console.log("hello in radio");

        return (
            <div className="testFont">
                {JSON.stringify(radio)}
            </div>
        );
    }
}


