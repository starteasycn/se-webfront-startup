/**
 * Created by wushang on 8/14/16.
 */
/**
 * 设置/获取 当前被选中
 *
 * @param currentNavItem
 * @returns {*}
 */
export function menuItem(currentNavItem = null) {
    if (sessionStorage) {
        if (currentNavItem === null) {
            //get
            return sessionStorage.currentNavItem
        } else {
            //set
            sessionStorage.currentNavItem = currentNavItem
            return currentNavItem
        }
    } else {
        console.log('浏览器不支持sessionStorage')
        return null
    }

}