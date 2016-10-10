//操作cookie的库

/**
 *
 * @param c_name
 * @returns {string}
 */

// unescape is Deprecation in js1.5
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/unescape
window.unescape = window.unescape || window.decodeURI;
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            var c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
/**
 *
 * @param c_name
 * @param value
 * @param expiredays
 */
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

module.exports = {
    getCookie,
    setCookie
}