//创建元素
//1.标签名 2.什么类名 3.设置样式
function createEl(elName, classArr, styleObj) {
    //1.传什么参数,创建什么
    var dom = document.createElement(elName);
    //2.类名很多,用数组放 ,循环数组每一位,并加入dom类名列表
    for (let i = 0; i < classArr.length; i++) {
        dom.classList.add(classArr[i]);
    }
    //3.键值对 因为变量不能通过.访问 ,使用[]访问
    for (var key in styleObj) {
        dom.style[key] = styleObj[key];
    }

    //返回值 我创建好的元素返回回去
    return dom;
}

//封装 存数据  value是对象或者数组,判断
function setLocal(key, value) {
    if (typeof value === "object" && value !== null) {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}

//封装 取数据
function getLocal(key) {
    var value = localStorage.getItem(key);
    if (value === null) {
        return value;
    }
    if (value[0] === "[" || value[0] === "{") {
        return JSON.parse(value);
    }
    return value;
}

//给 得分当前时间前面加上 0
function formatNum(num) {
    if (num < 10) {
        return "0" + num;
    }
    return num;
}