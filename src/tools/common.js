//
//
// import tool from './tool'
// import echarts from 'echarts'
//
var pprikey ={};
var chartLists = null;
// var echarts_common = null;
// var tool_common = null;
// var getChartOption_common = null;

var chartData = null;

function downloadTableFun(url){
    window.location.href = url;
}
// function changeLine(id,name){
//     var companyName = {};
//     companyName.paramName=name;
//     // pprikey[id+""] = companyName;
//     var data  = $.extend({}, chartData,companyName);
//     refreshChartData(id,data);
//     // refreshChartData(chartNum,"",null,true,"paramName="+name);
// }
//
// function getChartById(id){
//     var index= 0;
//     for(var i=0;i<chartLists.length;i++){
//         var flow = chartLists[i];
//         if(flow.chartType == "chart"
//             ||flow.chartType == "bar"
//             ||flow.chartType == "line"
//             ||flow.chartType == "map"
//             ||flow.chartType == "newmap"
//             ||flow.chartType == "table"
//         ){
//             if(index == id) {
//                 return flow;
//             }
//             index=index+1;
//         }
//     }
// }
//
// function refreshChartData(id,data){
//
//     var flow = this.getChartById(id);
//     var chartId=   flow.chartNum + "" + flow.id;
//     //Step.2 渲染后台数据
//
//     if(flow.chartType == "chart"
//         ||flow.chartType == "bar"
//         ||flow.chartType == "line"
//         ||flow.chartType == "map"
//     ){
//         echarts_common.init(document.getElementById(chartId)).showLoading({
//             text : '数据加载中',
//             effect : 'spin',
//             textStyle : {
//                 fontSize : 30
//             }
//         });
//         initChartData(flow,chartId,data);
//     }else if(flow.chartType == "newmap"
//         ||flow.chartType == "table"
//     ){
//         initTabData(flow,chartId,data);
//     }
//
// }
//
// function initChartData (flow,chartId,data){
//     data.chartNum =flow.chartNum;
//     tool_common.ajaxGet(window.TARGETWEBSITE+flow.url, data, function (res) {
//         try {
//             var chartDom = echarts_common.init(document.getElementById(chartId));
//             var option = getChartOption_common(res,flow)
//             chartDom.setOption(option);
//         } catch (err) {
//             throw err
//         }
//     }, function (res) {
//         commonJs.alertTop("坏的凭证", "error");
//     })
// }
// function initTabData (flow,chartId,data){
//     data.chartNum =flow.chartNum;
//     tool_common.ajaxGet(window.TARGETWEBSITE+flow.url, data, function (res) {
//         try {
//             var chartDom = echarts_common.init(document.getElementById(chartId));
//             var option = getChartOption_common(res,flow)
//             chartDom.setOption(option);
//         } catch (err) {
//             throw err
//         }
//     }, function (res) {
//         commonJs.alertTop("坏的凭证", "error");
//     })
// }