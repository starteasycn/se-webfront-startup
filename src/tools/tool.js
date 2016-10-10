/**
 *  工具类函数
 */

/**
 * 将js转换为get请求中带的参数,例如{a: '1', b: '2'} --> ?a=1&b=2
 * 注:不支持对象嵌套
 * */
function parseObjToUrl(paramObj) {
    var keys = Object.keys(paramObj);
    var param = '';
    var i, chainChar;
    var startChar = '?';
    for (chainChar = '', i = 0; i < keys.length; i++, chainChar = '&', startChar = '') {
        param += startChar + chainChar + keys[i] + '=' + paramObj[keys[i]];
    }

    return param;
}
/**
 * 拼装对象到字符串模板中,用法如下:
 * eg:       tmplFn('hi~ ${this.name}', {name: 'iswear'})
 * return:   "hi~ iswear"
 * @param str
 * @param obj
 * @returns {*}
 */
function tmplFn(str, obj) {
    var fnStr = 'return `' + str + '`;';
    var fn = new Function(fnStr);
    return fn.call(obj)
}

function ajaxGet(url, data, successFun, errorFun) {
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: data || {},
        success: function (res) {
            if ("0000000" != res.rtnCode) {
                if (errorFun) {
                    errorFun(res)
                } else {
                    //alert(res.msg);
                }
            } else {
                if (successFun) {
                    successFun(res)
                }
            }
        },
        error: function (res) {
            if (errorFun) {
                errorFun(res)
            } else {
                //alert("接口返回失败");
            }
        }
    })
}


function ajaxGet(url, data, successFun, errorFun) {
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: data || {},
        success: function (res) {
            if ("0000000" != res.rtnCode) {
                if (errorFun) {
                    errorFun(res)
                } else {
                    //alert(res.msg);
                }
            } else {
                if (successFun) {
                    successFun(res)
                }
            }
        },
        error: function (res) {
            if (errorFun) {
                errorFun(res)
            } else {
                //alert("接口返回失败");
            }
        }
    })
}


function ajaxGetCustom(url, data, successFun, errorFun, flow) {
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        data: data || {},
        success: function (res) {
            if ("0000000" != res.rtnCode) {
                if (errorFun) {
                    errorFun(res)
                } else {
                    //alert(res.msg);
                }
            } else {
                if (successFun) {
                    successFun(res, flow)
                }
            }
        },
        error: function (res) {
            if (errorFun) {
                errorFun(res)
            } else {
                //alert("接口返回失败");
            }
        }
    })
}


function ajaxAsyncGet(url, data, successFun, errorFun) {
    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        async: false,
        data: data || {},
        success: function (res) {
            if ("0000000" != res.rtnCode) {
                if (errorFun) {
                    errorFun(res)
                } else {
                    //alert(res.msg);
                }
            } else {
                if (successFun) {
                    successFun(res)
                }
            }
        },
        error: function (res) {
            if (errorFun) {
                errorFun(res)
            } else {
                //alert("接口返回失败");
            }
        }
    })
}


function ajaxPost(url, data, successFun, errorFun, isCredentials) {
    $.ajax({
        url: url,
        type: "post",
        dataType: "json",
        xhrFields: {
            withCredentials: isCredentials
        },
        data: data || {},
        success: function (res) {
            if ("0000000" != res.rtnCode) {
                if (errorFun) {
                    errorFun(res)
                }
            } else {
                successFun(res)
            }
            commonJs.refreshCookie();

        },
        error: function (res) {
            if (errorFun) {
                errorFun(res)
            } else {
                //alert("接口查询返回失败");
            }
        }
    })
}
module.exports = {
    ajaxGet,
    ajaxPost,
    parseObjToUrl,
    tmplFn, ajaxAsyncGet, ajaxGetCustom
}
