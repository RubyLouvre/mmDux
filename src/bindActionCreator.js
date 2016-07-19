function bindActionCreator(actionCreator, dispatch) {
    return function () {
        return dispatch(actionCreator.apply(undefined, arguments))
    }
}
/*
用于描述action的dispatch的逻辑。

action的重用
数据的预处理
action的特殊处理逻辑

 */

function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
        return bindActionCreator(actionCreators, dispatch)
    }

    if (!avalon.isObject(actionCreators)) {
        avalon.error('bindActionCreators的第一个参数必须是纯对象或函数')
    }

    var keys = Object.keys(actionCreators)
    var boundActionCreators = {}
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        var actionCreator = actionCreators[key]
        if (typeof actionCreator === 'function') {
            boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
        }
    }
    return boundActionCreators
}

module.exports = bindActionCreators