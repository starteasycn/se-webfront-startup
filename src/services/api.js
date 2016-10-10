/**
 * Created by wushang on 7/30/16.
 *
 * 此文件中编写所有异步获取数据的逻辑,所有函数的返回对象都是Promise,以便被 saga 中 yield call 等方法调用
 */

import  {Promise} from 'es6-promise';
import 'whatwg-fetch';
import  {cookie, tool} from '../tools'
import _ from 'lodash'

/**
 * 获取目录数据
 * 如果sessionStorage中有,则从sessionStorage中获取,
 *
 * @param useCache
 * @returns {*}
 */
export function fetchMenuData(useCache = true) {
    var accessToken = cookie.getCookie('access_token')
    var registerAccount = cookie.getCookie('registerAccount')
    var url = window.TARGETWEBSITE+`/fc/dap/hive?access_token=${accessToken}&registerAccount={registerAccount}`
    // url = 'https://api.github.com';

    return new Promise((resolve, reject) => {
        if (sessionStorage && useCache && sessionStorage.menuData) {
            return resolve(JSON.parse(sessionStorage.menuData))
        } else {
            return fetch(url).then(res => {
                return res.json()
            }).then(json => {
                sessionStorage.menuData = JSON.stringify(json)
                return resolve(json)
            }).catch(err => {
                throw err
            })
        }
    })
}

/**
 * 刷新 月度目标统计 图表
 * @param countType
 * @param countTime
 * @returns {*}
 */
export function fetchTargetCountOfMonth(countType = 'sign', countTime = 0) {
    var url = `http://data.qtonecloud.cn/fc/dap/hive/web/chart?statisticsTarget=${countType}&weekSelect=${countTime}&resourceId=541&productCode=3&chartNum=1&zIndex=0`
    url = 'https://api.github.com/'
    return new Promise(resolve => {
        fetch(url).then(res => {
            return res.json()
        }).then(json => {
            //注: 待后台cors恢复正常时,可以 resolve(json) 来传递数据
            return resolve({
                "bizData": {
                    "legend": ["新增值"],
                    "xData": ["2016-07-07", "2016-07-14", "2016-07-21"],
                    "yData": {"新增值": ["107", "90", "49"]},
                    "units": ["所"],
                    "title": "认证学校统计"
                }, "rtnCode": "0000000", "ts": 1469673062669
            })
        })
    })
}
/**
 * 根据页面名称获取页面结构数据,用于生成通用界面
 * @param pageName
 * @returns {*}
 */
export function fetchCommonPageData(resourceId) {
    return new Promise((resolve, reject) => {

        //Step.1 通过 pageName 获取 页面结构数据的url
        // resourceId=541;
        //Step.2 通过元数据url,获取页面结构数据
        var url = window.TARGETWEBSITE+`/fc/dap/getElements?resourceId=${resourceId}&productCode=${sessionStorage.menuData.sysType}&reportId=${resourceId}&zIndex=0`;
        console.log(url);
        // url = 'https://api.github.com/'
        //发送请求
        fetch(url, {credentials: 'include'}).then(res => {return res.json()}).then(json => {

            var page = getPageData(json.bizData);
            page.page.resourceId = resourceId;
            console.log(JSON.stringify(page));
            var result = resolve(page);
            return result;
        })

    })
}


function getPageData(bizData) {
    var page = {};
    var filter = [];
    var pageFlow = [];
    var dataSource = [];
    var condition = bizData.condition;
    var reportConfigs = bizData.reportConfigs;
    for(var index=0;index<condition.length;index++){
        var item = {}
        item.name=condition[index].name;
        item.type=condition[index].editorType;
        item.title=condition[index].lable;
        item.lineBegin=condition[index].lineBegin;
        item.values=condition[index].values;
        filter.push(item);
    }
    page.filter = condition;
    page.pageFlow = reportConfigs;

    var newpage = {};
    newpage.page = page
    return newpage;
}

/**
 * 通过过滤条件获取通用界面数据, http Get 请求
 * @param filters   {param1: {value: 'a'}, param2: {value: 'b'}}
 * @param task      {name: 'xxx', url: 'xxx'}
 * @returns {*}
 */
export function fetchCommonDataByFilters(filter, task) {
    //将参数格式变为 {param1: 'a', param2: 'b}
    let param = _.reduce(filter.filters, function (result, next, name, obj) {
        result[name] = next.value
        return result
    }, {})
    var params =  tool.parseObjToUrl(param);
    let url = window.TARGETWEBSITE+task.url + tool.parseObjToUrl(param)+"&productCode=${sessionStorage.menuData.sysType}&resourceId="+filter.resourceId+"&chartNum="+task.chartNum;
    
    return new Promise((resolve, reject) => {
        fetch(url, {credentials: 'include'})
            .then(res => {
                return res.json()
            })
            .then(json => resolve({[task.chartNum]: json}))
            .catch(err => {
                reject(err)
            })
        

    })


}