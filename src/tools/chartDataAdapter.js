/**
 * Created by wushang on 7/28/16.
 */

import tool from './tool'
import echarts from 'echarts'
require('echarts/map/js/china-contour.js');
require('echarts/map/js/china.js');
require('echarts/map/js/province/guangdong.js');

require('echarts/theme/macarons.js');
// require('echarts/theme/default.js');
// require('echarts/theme/dark.js');
// require('echarts/theme/infographic.js');
// require('echarts/theme/macarons.js');
// require('echarts/theme/roma.js');
// require('echarts/theme/shine.js');
// require('echarts/theme/blue.js');
var color = [
    '#95dabb', '#ffde9b', '#a4d1ef', '#ffb980', '#d87a80',
    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
];

var selectedTarget = $({}); //被选中的target,有selected事件  参数依次为  event,targetKey

/**
 * 图表数据适配
 * @param res
 * @returns {*}
 */

function getUnit(units) {
    var unit = {};
    if (units.length > 1) {
        var str = "";
        for (var i = 0; i < units.length; i++) {
            if (i == 0)
                str += units[i];
            else
                str += "," + units[i];

        }
        try {
            unit = JSON.parse(str);
            unit.islineBar = 1;
        } catch (e) {
            unit.unit = units[0];
            unit.unit1 = units[1];
            unit.num = 1;
            unit.islineBar = 1;

        }

    }
    else {
        unit.islineBar = 2;
        unit.unit = units[0];
        unit.num = 0;
    }
    return unit;
}


function appendDownload(flow, chartId, data, title) {

    $("#" + chartId).find(".flow_table_title").remove();
    var oDiv = document.createElement("div");
    $(oDiv).addClass("flow_table_title");
    var url = window.TARGETWEBSITE + flow.downUrl + tool.parseObjToUrl(data);
    oDiv.innerHTML = "<label>" + title + "</label></label><a href='javascript:void(0)' class='funnelDownloadTable' onclick='downloadTableFun(\"" + url + "\" )'>" +
        "下载表格 " +
        "<i class='glyphicon glyphicon-cloud-download'></i> " +
        "</a>";
    $("#" + chartId).append(oDiv);

}


function setRate(value) {
    if (value == null || value == "") {
        return value;
    }

    if (value.indexOf("-") != -1) {
        return '<span style="color:red">' + value + '</span>';
    }
    else {
        return '<span style="color:green">' + value + '</span>';
    }

};

function getTable(res, flow, data) {
    var chartId = flow.chartNum + "" + flow.id;
    $("#" + chartId).find(".pageFoot").remove();
    var tableData = res.bizData.rows;
    var option = {}
    if (flow.downAble) {
        appendDownload(flow, chartId, data, "表格标题");
    }

    localStorage.removeItem("tableData" + chartId);
    localStorage.removeItem("chartList" + chartId);
    localStorage.setItem("tableData" + chartId, JSON.stringify(tableData));
    localStorage.setItem("chartList" + chartId, JSON.stringify(flow.config));


    var oTable = document.createElement("table");
    $(oTable).addClass("tableStyle");

    if (tableData.length < 10) {
        tableData = appendTable(chartId, 0, tableData.length - 1, "", "");
    } else {
        tableData = appendTable(chartId, 0, 10, "", "");
    }

    // $("#" + chartId).find(".pageFoot").remove();
}


function tableColumnFormat(formatConfig, tableData) {
    var reCalcIndex = {};

    for (var i = 0; i < formatConfig.length; i++) {
        var calcItem = formatConfig[i];
        reCalcIndex[calcItem.colIndex] = calcItem.reCalc;
    }

    var headers = tableData[0];
    for (var rowIndex = 1; rowIndex < tableData.length; rowIndex++) {

        for (var colIndex = 0; colIndex < tableData[rowIndex].length; colIndex++) {

            if (reCalcIndex[colIndex]) {
                //需要重计算或者格式化
                var reCalcRule = reCalcIndex[colIndex];

                for (var j = 0; j < reCalcRule.length; j++) {
                    var rule = reCalcRule[j];
                    if (rule.type === 'calc') {
                        //对列进行计算
                        calcPercent(tableData, rule.colIndex, colIndex);

                    } else if (rule.type === 'format') {
                        //对列进行格式化
                        toPercent(tableData, rule.value, colIndex);
                    }
                }

            } else {
                continue;
            }

        }
    }
}


function appendTable(chartId, start, end, tdindex, sort) {
    $("#" + chartId).find("table").children().remove();
    var config = null;
    if (localStorage.getItem("chartList" + chartId) != "undefined") {
        config = JSON.parse(localStorage.getItem("chartList" + chartId));
    }

    var tableData = JSON.parse(localStorage.getItem("tableData" + chartId));
    //创建table
    var oTable = document.createElement("table");
    $(oTable).addClass("tableStyle");
    oTable.innerHTML = str;
    $("#" + chartId).append(oTable);


    var setRate = function (value) {
        if (value == null || value == "") {
            return value;
        }

        if (value.indexOf("-") != -1) {
            return '<span style="color:red">' + value + '</span>';
        }
        else {
            return '<span style="color:green">' + value + '</span>';
        }

    };
    var str = '';
    var addDo = false;
    var controlchartNum = -1;
    var rate = "";
    var columNames = "";

    if (config) {
        var tabcf = config;
        var cfJson = JSON.parse(tabcf);

        if (cfJson.hasOwnProperty("format")) {
            var tableFormatConfig = cfJson["format"];   //获取表格字段格式化信息
            tableColumnFormat(tableFormatConfig, tableData);
        }

        if (cfJson.add) {
            addDo = true;
        }
        controlchartNum = cfJson.control;

        if (cfJson.rate) {
            var rate = cfJson.rate;
            var columNames = cfJson.titleNams;
        }
        var addSearchElement = "";
        if (cfJson.addSearchElement) {
            addSearchElement = cfJson.addSearchElement;
        }

    }


    //其实排序很简单,重要业务就在这里,这里也一个方法处理
    if (tdindex != "" && sort != "") {
        tableData = sortTalbeData(tableData, tdindex, sort);
    }


    var sortClass = "";
    if (tdindex != "") {
        if (sort == "") {
            sortClass = "glyphicon-arrow-up";
        } else {
            if (sort == "asc") {
                sortClass = "glyphicon-arrow-up";
            } else {
                sortClass = "glyphicon-arrow-down";
            }
        }
    } else {
        sortClass = "glyphicon-sort";
    }


    //这里是处理表头信息
    str += "<tr class='tableTrStyle'>";
    var lines = tableData[0].length;
    var columnwidth = lines;
    if (addDo)
        columnwidth += 1;

    var spanSort = "";
    for (var j = 0; j < lines; j++) {
        var cellValue = tableData[0][j];
        cellValue = toThousands(cellValue);
        if (tdindex != j) {
            spanSort = "glyphicon-sort";
        } else {
            spanSort = sortClass;
        }
        str += "<td class='tableTdStyle' style='width:" + (100 / columnwidth) + "%'" + ">" + cellValue + "<span class='glyphicon sortFiled " + spanSort + "' aria-hidden='true' style='float: right;top: 15px' sort='" + sort + "' tdindex='" + j + "'></span></td>";

    }
    if (addDo) {
        str += "<td class='tableTdStyle' style='width:" + (100 / columnwidth) + "%'" + ">操作</td>";
    }
    str += "</tr>";

    //表头信息处理完毕
    for (var i = start + 1; i < end + 1; i++) {
        str += "<tr class='tableTrStyle'>";

        var lines = tableData[i].length;
        var columnwidth = lines;
        if (addDo)
            columnwidth += 1;
        for (var j = 0; j < lines; j++) {
            var cellValue = tableData[i][j];

            cellValue = toThousands(cellValue);
            if (i > 0 && columNames != "" && columNames.indexOf("-" + tableData[0][j] + "-") != -1) {
                str += "<td class='tableTdStyle' style='width:" + (100 / columnwidth) + "%'" + ">" + eval(rate + "('" + cellValue + "')") + "</td>";
            } else {
                str += "<td class='tableTdStyle' style='width:" + (100 / columnwidth) + "%'" + ">" + cellValue + "</td>";
            }

        }
        if (addDo) {
            if (i == 0) {
                str += "<td class='tableTdStyle' style='width:" + (100 / columnwidth) + "%'" + ">操作</td>";
            } else if (tableData[i][0] == "总计") {
                str += "<td class='tableTdStyle' style='width:" + (100 / columnwidth) + "%'" + "></td>";
            }
            else {
                str += "<td class='tableTdStyle' align='center' style='width:" + (100 / columnwidth) + "%'"
                    + "><a href='javascript:void(0)'  style='background-color:#fdc638;width: 60px;line-height:24px;height: 24px;color:black;text-align:center;display:block' onclick=changeLine('" + controlchartNum + "','" + s + "','" + tableData[i][0] + "','" + addSearchElement + "')>查看</a></td>";
            }
        }
        str += "</tr>"
    }
    oTable.innerHTML = str;

    $("#" + chartId).append(oTable);
    //这里计算一下总页数  默认一页是10条
    var pos = 10;
    var totalCount = parseInt(tableData.length);
    var pageSize = parseInt(totalCount / pos);
    if (totalCount % pos > 0) {
        pageSize += 1;
    }


    var oldFoot = $("#" + chartId).find(".pageFoot").html();
    if (oldFoot != null && oldFoot != "undefined") {
        console.log(tableData.length)
        $("#" + chartId).find(".pageFoot").remove();
        oldFoot = "<div style='text-align:center' class='pageFoot'>" + oldFoot + "</div>";
        $("#" + chartId).append(oldFoot);
    } else {
        var html = "<div style='text-align:center' class='pageFoot'><span class='condition_select_button lastPage' style='display: inline-block;line-height: 30px'>上一页</span>" +
            "<span class='nowPage' style='margin: 0 10px' sort='' tdindex=''>1</span>" +
            "<span class='condition_select_button nextPage' style='display: inline-block;line-height: 30px;margin-right: 10px'>下一页</span>" +
            "共<span class='pageSize' style='margin: 0 5px'>" + pageSize + "</span>页&nbsp;&nbsp;" +
            "共<span class='pageTotal' style='margin: 0 5px'>" + (totalCount - 1) + "</span>条</div>";
        console.log("foot:", html)
        $("#" + chartId).append(html);
    }


    var parentDom = $("#" + chartId);
    parentDom.find(".lastPage").click(function () {
        var nowPageSize = parseInt(parentDom.find(".nowPage").html());
        if (nowPageSize <= 1) {
            alert("已经是第一页了");
            return false;
        }
        parentDom.find(".nowPage").html(nowPageSize - 1);
        var sort = parentDom.find(".nowPage").attr("sort");
        var tdindex = parentDom.find(".nowPage").attr("tdindex");

        appendTable(parentDom.attr("id"), (nowPageSize - 2) * 10, (nowPageSize - 1) * 10, tdindex, sort);


    })
    parentDom.find(".nextPage").click(function () {
        var nowPageSize = parseInt(parentDom.find(".nowPage").html());
        var pageSize = parseInt(parentDom.find(".pageSize").html())
        if (nowPageSize == pageSize) {
            alert("已经是最后一页了");
            return false;
        }
        parentDom.find(".nowPage").html(nowPageSize + 1);

        var pageTotal = parseInt(parentDom.find(".pageTotal").html());

        var sort = parentDom.find(".nowPage").attr("sort");
        var tdindex = parentDom.find(".nowPage").attr("tdindex");
        if ((nowPageSize + 1) * 10 > pageTotal) {
            appendTable(parentDom.attr("id"), nowPageSize * 10, pageTotal, tdindex, sort);
        } else {
            appendTable(parentDom.attr("id"), nowPageSize * 10, (nowPageSize + 1) * 10, tdindex, sort);
        }


    });


    parentDom.find(".sortFiled").click(function () {
        var sort = $(this).attr("sort");
        var tdindex = $(this).attr("tdindex");
        var sortClass = "";
        if (sort == "") {
            sort = "asc";  //默认升序排序
        } else {
            if (sort == "asc") {
                sort = "desc";
            } else {
                sort = "asc";
            }
        }

        //这里要获取字段


        parentDom.find(".nowPage").html("1");
        parentDom.find(".nowPage").attr("sort", sort);
        parentDom.find(".nowPage").attr("tdindex", tdindex);
        parentDom.find(".nowPage").html("1");

        if (totalCount <= 10) {
            appendTable(parentDom.attr("id"), 0, totalCount - 1, tdindex, sort);
        } else {
            appendTable(parentDom.attr("id"), 0, 10, tdindex, sort);
        }


    })

    return tableData;
}


//处理排序算法
function sortTalbeData(tableData, tdindex, sort) {
    if (tableData) {
        var aTrs = new Array();
        //将将得到的列放入数组，备用


        //顺便在这里判断以下类型
        var type = "string";
        for (var i = 1; i < tableData.length; i++) {
            aTrs[i - 1] = tableData[i];
            if (!isNaN(aTrs[i - 1][tdindex])) {
                type = "int";
            }
        }

        aTrs.sort(compareEle(tdindex, type));
        if (sort != "") {
            if (sort == "desc") {
                aTrs.reverse();
            }
        }

        //这里重新组装,主要是把表格的表头放到数组第一个
        console.log(tableData)

        console.log(aTrs)

        var result = [];
        result.push(tableData[0]);
        for (var pos = 0; pos < aTrs.length; pos++) {
            result.push(aTrs[pos]);
        }

        console.log(result)
        return result;

    }

}

function convert(sValue, dataType) {

    if (sValue != "") {
        if (sValue.indexOf("%") > -1) {
            sValue = sValue.replace("%", "");
            dataType = "float";
        }
    }

    switch (dataType) {
        case "int":
            return parseInt(sValue);
        case "float":
            return parseFloat(sValue);
        case "date":
            return new Date(Date.parse(sValue));
        default:
            return sValue.toString();
    }
}


function compareEle(iCol, dataType) {
    return function (oTR1, oTR2) {
        var vValue1 = convert(oTR1[iCol], dataType)
        var vValue2 = convert(oTR2[iCol], dataType)
        if (vValue1 < vValue2) {
            return -1;
        } else if (vValue1 > vValue2) {
            return 1;
        } else {
            return 0;
        }
    };
}


//获取所有指标
var getAllTarget = function () {
    return $.ajax({
        url: "/fc/dap/hive/all/target",
        method: "GET",
        data: {
            chartNum: 1,
            startTime: "2016-01-23",
            endTime: "2016-02-12"
        }
    });
};


var refreshChartDataByTarget = function (callback, beginIndex, userTarget, that, flag, tabparam) {
    var len = chartLists.length;
    for (var s = beginIndex; s < len; s++) {
        (function (s) {
            callback(s, userTarget, that, flag, tabparam);
        })(s)
    }
};

var clickTarget = function (callback, beginIndex, userTarget, that, flag, tabparam) {
    selectedTarget.trigger('selected', [callback, beginIndex, userTarget, that, flag, tabparam]);
    refreshChartDataByTarget(callback, beginIndex, userTarget, that, flag, tabparam);
};


function getChartOption(res, flow, data) {

    if (flow.chartType == "table") {
        return getTable(res, flow, data);
    }
    else if (flow.chartType == "newmap") {
        var chartId = flow.chartNum + "" + flow.id;
        var chartDiv = document.getElementById(chartId);
        chartDiv.style.width = 90 + '%';
        chartDiv.style.height = 500 + 'px';
        chartDiv.style.margin = 3 + '%';
        chartDiv.style.marginLeft = 5 + '%';

        var chartObj = echarts.init(chartDiv, window.theme);
        var option = getMapOption(res.bizData)
        console.log(JSON.stringify(option))
        chartObj.setOption(option);
        // chartObj.un("click");
        chartObj.on("click", function (clickProvince) {
            clickMap(clickProvince.name, chartId, chartObj, flow, data);
        });
    } else if (flow.chartType == "pie") {
        return getPieOption(res, flow);
    }
    else {
        return getOption(res, flow);
    }


}
var mapIndex = 0;
function clickMap(name, chartId, chartObj, flow, data) {
    mapIndex += 1;
    var target = {};
    target.chartNum = flow.chartNum;
    target.isCity = 1;
    target.paramName = name;
    pprikey[flow.chartNum] = target;
    var target = $.extend({}, data, target);

    tool.ajaxGet(window.TARGETWEBSITE + flow.url, target, function (res) {
        if (res.msg) {
            document.getElementById(chartId).innerHTML = res.msg;
            return;
        }
        if (chartObj) {
            chartObj.clear();
            chartObj.dispose();
            chartObj = null;
        }
        res.bizData.title = name;
        chartObj = chartObj || echarts.init(document.getElementById(chartId), window.theme);
        chartObj.setOption(getMapOption(res.bizData));
        var cf = flow.config;
        var cfjson = JSON.parse(cf);
        var controls = cfjson.control.split(",");
        var control_tab = -1;
        if (cfjson.control_tab)
            control_tab = cfjson.control_tab;
        if (control_tab > -1) {
            var flow_tab = getTabByChartNum(control_tab);
            tabColorChange(flow_tab.chartNum + "" + flow_tab.id, 0);
        }

        for (var i = 0; i < controls.length; i++) {
            refreshChartData(controls[i], target);
        }

        var backBtn = $("<a href='javascript:void(0)' class='backButton' >返回</a>");

        $("#" + chartId).append(backBtn);
        backBtn.on('click', function () {
            //backBtn.remove();
            //返回
            chartObj.clear();
            chartObj.dispose();
            chartObj = null;
            if (control_tab > -1) {
                var flow_tab = getTabByChartNum(control_tab);
                tabColorChange(flow_tab.chartNum + "" + flow_tab.id, 0);
            }
            initTabData(flow, chartId, data)
            for (var i = 0; i < controls.length; i++) {
                refreshChartData(controls[i], data);
            }
        })
    }, function (res) {
        commonJs.alertTop("坏的凭证", "error");
    })

}
function getWidth(flow) {
    if (flow.config) {
        var config = JSON.parse(flow.config);
        if (config.contentclass) {
            var divClass = config.contentclass;
            if (divClass.indexOf("flowWidth") != -1) {
                return false;
            }
        }
    }
    return true;
}
function getOption(res, flow) {
    var legendData = res.bizData.legend;
    var xData = res.bizData.xData;
    var yData = res.bizData.yData;
    var title = res.bizData.title;
    var units = getUnit(res.bizData.units);
    var is100width = getWidth(flow);
    var bars = legendData.length * xData.length;

    var customYaxis = [
        {
            type: 'value',
            splitLine: {
                show: false
            },
            data: yData,
            axisLine: {
                lineStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#5c94c0' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#5c94c0' // 100% 处的颜色
                    }], false),
                    width: '2'
                }
            },
            axisLabel: {

                formatter: '{value}' + units.unit
            }
        },
        {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0, color: '#0ecca0' // 0% 处的颜色
                    }, {
                        offset: 1, color: '#0ecca0' // 100% 处的颜色
                    }], false),
                    width: '2'
                }
            },
            axisLabel: {

                formatter: '{value}' + units.unit1
            }
        }
    ];

    if (units.islineBar == 2) {
        customYaxis = [
            {
                type: 'value',
                splitLine: {
                    show: false
                },
                data: yData,
                axisLine: {
                    lineStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0, color: '#0ecca0' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#0ecca0' // 100% 处的颜色
                        }], false),
                        width: '2'
                    }
                },
                axisLabel: {

                    formatter: '{value}' + units.unit
                }

            }
        ];
    }

    const option = {
        backgroundColor: '#ffffff',

        title: {
            text: title
        },
        tooltip: {
            trigger: "{b}:{c}"
        },
        legend: {
            bottom: 0,
            data: legendData
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: false},
                dataView: {show: false, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: false},
                saveAsImage: {show: false}
            }
        },
        calculable: true,
        grid: {
            top: 35,
            left: '3%',
            right: '4%',
            bottom: 40,
            containLabel: true
        },

        xAxis: [
            {
                type: 'category',
                splitLine: {
                    show: false
                },
                data: xData,
                axisLine: {
                    lineStyle: {
                        color: '#0ecca0',
                        width: '2'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'black',
                        fontSize: 12,
                        fontStyle: 'normal',
                        fontWeight: 'normal'
                    }
                },


                boundaryGap: true
            }
        ],
        yAxis: customYaxis,
        series: legendData.map((item, index) => {
            var type = "bar";
            var isstack = false;
            if (index >= units.num && units.islineBar == 1 && flow.chartType == "chart") {
                type = "line";
            } else if (flow.chartType == "stack" || flow.chartType == "stacked") {
                type = "bar";
                isstack = true;
            } else if (flow.chartType == "chart") {
                type = "bar";
            } else {
                type = flow.chartType;
            }
            var series_data = {
                name: item,
                type: type,
                data: yData[item],
                itemStyle: {
                    normal: {
                        color: color[index],
                        label: {
                            show: true,

                            textStyle: {
                                color: '#555'
                            },
                            position: "top"
                        }
                    }
                },
                yAxisIndex: (units.islineBar == 1 && index >= units.num ? 1 : 0)
            }

            if (is100width) {
                if (bars < 20) {
                    series_data.barWidth = 50;
                }
            } else {
                if (bars < 7) {
                    series_data.barWidth = 50;
                }
            }


            if (isstack) {
                series_data.stack = "0";

            }


            return (
                series_data
            );
            // var type = "bar";
            // var isstack = "0";
            // if (index >= units.num && units.islineBar == 1 && flow.chartType=="chart") {
            //     type = "line";
            //     isstack="1";
            // } else if(flow.chartType="stack"){
            //     type = "bar";
            // }
            // else{
            //     type = flow.chartType;
            // }
            // var series_data =
            // return (
            // {
            //     name: item,
            //     type: type,
            //     data: yData[item],
            //     stack:"1",
            //     barWidth:50,
            //     itemStyle: {
            //         normal: {
            //             color: color[index],
            //             label: {
            //                 show: true,
            //
            //                 textStyle: {
            //                     color: '#555'
            //                 },
            //                 position: "top"
            //             }
            //         }
            //     },
            //     yAxisIndex:  (unitsa.islineBar == 1 && index >= unitsa.num ?1:0)
            // }
            // );
        })
    };

    return option;

}

function getMapOption(bizData) {
    var legend = bizData.legend;
    var series = bizData.series;
    var title = bizData.title;

    for (var i = 0; i < series.length; i++) {
        series[i].itemStyle = {
            normal: {label: {show: true}},
            emphasis: {label: {show: true}}
        }
    }
    var option = {
        title: {
            text: title,
            padding: [
                0,  // 上
                0, // 右
                20,  // 下
                0, // 左
            ],
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (data) {
                var keys = data.data.seriesIndex || [];
                var values = data.data.valueMap || [];
                var str = "";
                for (var s = 0, len = keys.length; s < len; s++) {
                    str += legend[keys[s]] + ":" + values[keys[s]] + "<br>";
                }
                return str;
            }
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: legend
        },
        dataRange: {
            min: 0,
            max: 2500000,
            x: 'left',
            y: 'bottom',
            text: ['高', '低'],           // 文本，默认为数值文本
            calculable: true
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
                mark: {show: false},
                dataView: {show: true, readOnly: false},
                restore: {show: false},
                saveAsImage: {show: false}
            }
        },
        roamController: {
            show: false,
            x: 'right',
            mapTypeControl: {
                'china': true
            }
        },
        series: series
    };
    return option;
}


function getChartById(id) {
    var index = 0;
    for (var i = 0; i < chartLists.length; i++) {
        var flow = chartLists[i];
        if (flow.chartType == "chart"
            || flow.chartType == "bar"
            || flow.chartType == "line"
            || flow.chartType == "map"
            || flow.chartType == "newmap"
            || flow.chartType == "table"
        ) {
            if (index == id) {
                return flow;
            }
            index = index + 1;
        }
    }
}

function getTabByChartNum(chartNum) {
    for (var i = 0; i < chartLists.length; i++) {
        var flow = chartLists[i];
        if (flow.chartNum == chartNum) {
            return flow;
        }
    }
}

function refreshChartData(id, data) {

    var flow = getChartById(id);
    var chartId = flow.chartNum + "" + flow.id;
    //Step.2 渲染后台数据

    if (flow.chartType == "chart"
        || flow.chartType == "bar"
        || flow.chartType == "line"
        || flow.chartType == "map"
    ) {
        echarts.init(document.getElementById(chartId)).showLoading({
            text: '数据加载中',
            effect: 'spin',
            textStyle: {
                fontSize: 30
            }
        });
        initChartData(flow, chartId, data);
    } else if (flow.chartType == "newmap"
        || flow.chartType == "table"
    ) {
        initTabData(flow, chartId, data);
    }

}

function initChartData(flow, chartId, data) {
    data.chartNum = flow.chartNum;
    tool.ajaxGet(window.TARGETWEBSITE + flow.url, data, function (res) {
        try {
            var chartDom = echarts.init(document.getElementById(chartId));
            var option = getChartOption(res, flow)
            chartDom.setOption(option);
        } catch (err) {
            throw err
        }
    }, function (res) {
        commonJs.alertTop("坏的凭证", "error");
    })
}
function initTabData(flow, chartId, data) {
    data.chartNum = flow.chartNum;
    tool.ajaxGet(window.TARGETWEBSITE + flow.url, data, function (res) {
        try {
            var option = getChartOption(res, flow, data)
        } catch (err) {
            throw err
        }
    }, function (res) {
        commonJs.alertTop("坏的凭证", "error");
    })
}

function changeLine(chartNum, id, name, tab_chartNum) {
    var companyName = {};
    companyName.paramName = name;
    pprikey[chartNum] = companyName;
    var data = $.extend({}, chartData, companyName);
    if (tab_chartNum > -1) {
        var flow = getTabByChartNum(tab_chartNum);
        tabColorChange(flow.chartNum + "" + flow.id, 0);
    }

    refreshChartData(id, data);
}

function tabColorChange(chartId, tabIndex) {
    var item = document.getElementById(chartId);
    var nodeList = item.childNodes;
    for (var i = 0; i < nodeList.length; i++) {
        $(nodeList[i]).attr("class", "otherTabDiv");
        if (tabIndex == i) {
            $(nodeList[i]).attr("class", "fistTabDiv");
        } else {
            $(nodeList[i]).attr("class", "otherTabDiv");
        }

    }


};

function getPieOption(res, chartId) {
    var legendData = res.bizData.legend;
    var xData = res.bizData.xData;
    var yData = res.bizData.yData;
    var title = res.bizData.title;
    var units = res.bizData.units;

    var option = {
        title: {
            text: title,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}" + units + " ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: legendData
        },
        color: color,
        calculable: true,
        series: [
            {
                name: xData[0],
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: _.map(legendData, function (legendItem, index) {
                    var value = yData[legendItem][0];
                    var name = legendItem;
                    return {
                        value: value,
                        name: name
                    }
                }),
                itemStyle: {
                    normal: {
                        label: {
                            position: 'outer',
                            textStyle: {
                                color: 'black',
                                fontSize: 12,
                                fontStyle: 'normal',
                                fontWeight: 'normal'
                            },
                            formatter: function (params) {
                                return params.name + "\n" + (params.percent - 0).toFixed(2) + '%'
                            }
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: false
                        }
                    }

                }
            }
        ]
    };
    return option;
}


function calcPercent(tableData, originIndex, destIndex) {

    var sum = 0;
    var number = 0;
    for (var rowIndex = 1; rowIndex < tableData.length; rowIndex++) {
        number = parseFloat(tableData[rowIndex][originIndex]);
        sum += number;
    }

    if (sum === 0) {
        sum = 1;
    }

    for (rowIndex = 1; rowIndex < tableData.length; rowIndex++) {
        number = parseFloat(tableData[rowIndex][originIndex]);
        tableData[rowIndex][destIndex] = number / sum;
    }
}

function toPercent(tableData, formatType, index) {

    for (var rowIndex = 1; rowIndex < tableData.length; rowIndex++) {
        var value = parseFloat(tableData[rowIndex][index]);

        if ("percent" === formatType) {
            var num = new Number(value);
            num = num * 100
            tableData[rowIndex][index] = num.toFixed(2) + '%';
        }
    }
}


function toThousands(num) {


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

module.exports = {
    getChartOption, tabColorChange
}