function getStartDateOfThisComponent(startDateOfThisComponent) {
    var startDateOfThisComponent = new Date(2016, 6, 1);
    return startDateOfThisComponent;
}

/*
 *	获取年份列表，最早到2015年，最晚至今
 *
 */
function getYearList(startDateOfThisComponent) {

    var currentDate = new Date();

    var yearList = [];

    var leastCyc = getLeastCyc();

    for (var year = startDateOfThisComponent.getFullYear(); year <= currentDate.getFullYear() && year <= leastCyc.getFullYear(); year++) {
        yearList.push(year);
    }

    return yearList;
}


/*
 *	获取月份列表
 *
 */
function getMonthList(year, startDateOfThisComponent) {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var monthList = [];

    var leastCyc = getLeastCyc();

    var minMonth = 1;
    var maxMonth = 12;
    if (year == startDateOfThisComponent.getFullYear()) {
        //当前年是起始年,设置下限
        minMonth = startDateOfThisComponent.getMonth() + 1;
    }

    if (year == currentYear) {
        //当前年份
        maxMonth = currentDate.getMonth() + 1;
        if (maxMonth > leastCyc.getMonth() + 1) {
            maxMonth = leastCyc.getMonth() + 1;
        }
    }

    for (var month = minMonth; month <= maxMonth; month++) {
        monthList.push(month);
    }

    return monthList;
}


/*
 *	刷新日下拉框元素
 */
function refreshDayElement(dayElement, year, month, startDateOfThisComponent) {
    dayElement.html('');

    var dayList = getDayList(year, month, startDateOfThisComponent).reverse();


    var optionElement = null;
    for (var i = 0; i < dayList.length; i++) {
        if (i == 0) {
            optionElement = $("<option selected='selected' value='" + dayList[i].startMonth + "-" + dayList[i].startDay + "' >第" + dayList[i].weekOfMonth + "周(" + dayList[i].startMonth + "." + dayList[i].startDay + "-" + dayList[i].endMonth + "." + dayList[i].endDay + ")</option>")
        } else {
            optionElement = $("<option value='" + dayList[i].startMonth + "-" + dayList[i].startDay + "' >第" + dayList[i].weekOfMonth + "周(" + dayList[i].startMonth + "." + dayList[i].startDay + "-" + dayList[i].endMonth + "." + dayList[i].endDay + ")</option>")
        }
        dayElement.append(optionElement);
    }
}

/*
 *	获取日列表
 */
function getDayList(year, month, startDateOfThisComponent) {
    var currentDate = new Date();
    var firstStatisticsDay = new Date(year, month - 1, 1);
    var lastStatisticsDay = new Date(year, month, 0);

    var dayOfWeekTmp = 0;
    //计算统计周期， 周五到周四为一个周期，统计时间显示为周五

    dayOfWeekTmp = firstStatisticsDay.getDay();

    if (1 < dayOfWeekTmp && dayOfWeekTmp < 5) {	//第一个统计周期不包含上个月,第一个统计周期从本月第一个周五开始
        firstStatisticsDay = new Date(firstStatisticsDay.getTime() + getDayBetweenNextFirday(dayOfWeekTmp) * 86400000);
    } else {	//第一个统计周期包含上个月，第一个统计周期从上个月最后一个周五开始
        firstStatisticsDay = new Date(firstStatisticsDay.getTime() - getDayBetweenPreFirday(dayOfWeekTmp) * 86400000);
    }

    dayOfWeekTmp = lastStatisticsDay.getDay();

    if (0 < dayOfWeekTmp && dayOfWeekTmp < 5) {	//最后一个统计周期，从本月最后一个周五开始
        lastStatisticsDay = new Date(lastStatisticsDay.getTime() - getDayBetweenPreFirday(dayOfWeekTmp) * 86400000);
    } else {	//最后一个统计周期从本月倒数第二个周五开始，最后一个周五天数不足，属于下个月的统计周期
        lastStatisticsDay = new Date(lastStatisticsDay.getTime() - getDayBetweenPreFirday(dayOfWeekTmp) * 86400000 - 7 * 86400000);
    }

    var number2chinese = ["一", "二", "三", "四", "五", "六"];

    var statisticsDay = new Date(firstStatisticsDay.getFullYear(), firstStatisticsDay.getMonth(), firstStatisticsDay.getDate());

    var monthTmp;
    var dayTmp;

    var monthTmp2;
    var dayTmp2;
    var dayOptions = [];
    for (var weekOfMonth = 0; statisticsDay.getTime() <= lastStatisticsDay.getTime() && statisticsDay.getTime() >= startDateOfThisComponent.getTime(); weekOfMonth++) {

        monthTmp = statisticsDay.getMonth() + 1;
        dayTmp = statisticsDay.getDate();

        statisticsDay = new Date(statisticsDay.getTime() + 6 * 86400000);

        monthTmp2 = statisticsDay.getMonth() + 1;
        dayTmp2 = statisticsDay.getDate();


        if (statisticsDay.getTime() >= currentDate.getTime()) {
            break;
        }
        //
        // dayOptions.push({
        //     "value":startMonth + "-" + startDay,
        //     "name"
        //     "weekOfMonth":,
        //     "startMonth":monthTmp,
        //     "startDay":dayTmp,
        //     "endMonth":monthTmp2,
        //     "endDay":dayTmp2
        // });
        dayOptions.push({
            "value": monthTmp + "-" + dayTmp,
            "name": "第" + number2chinese[weekOfMonth] + "周(" + monthTmp + "." + dayTmp + "-" + monthTmp2 + "." + dayTmp2 + ")"
        });

        statisticsDay = new Date(statisticsDay.getTime() + 86400000);
    }

    return dayOptions;
}

/**
 * 获取最近的一个计算周期
 */
function getLeastCyc() {
    var currentDate = new Date();

    var dayOfWeek = currentDate.getDay();

    var leastCyc = new Date(currentDate.getTime() - getDayBetweenPreFirday(dayOfWeek) * 86400000);

    return leastCyc;
}

// 传递一个 dayOfweek  0~6 获取到达下一个周五的时间间隔
function getDayBetweenNextFirday(x) {
    var between = 5 - x;
    if (between >= 0) {
        return between;
    } else {
        x;
    }
}

function getDayBetweenPreFirday(x) {
    var between = x - 5;
    if (between >= 0) {
        return between;
    } else {
        return x + 2;
    }
}


function getDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    // var y = dd.getFullYear();
    // var m = dd.getMonth() + 1;//获取当前月份的日期
    // var d = dd.getDate();
    // if (m < 10) {
    //     m = "0" + m;
    // }
    // if (d < 10) {
    //     d = "0" + d;
    // }
    return dd;
}


function format(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;//获取当前月份的日期
    var d = date.getDate();
    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }
    return y + "-" + m + "-" + d;

}

function str2Date(str) {
    var date = Date.parse(str);
    return new Date(date);

}


module.exports = {
    getYearList, getMonthList, getDayList, getStartDateOfThisComponent, getDateStr, format,str2Date
}