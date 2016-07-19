var ActionTypes = {
    INIT: '@@redux/INIT'
}
createStore.ActionTypes = ActionTypes
/*
 * 
 redux.createStore(reducer, initialState) 传入了reducer、initialState，
 并返回一个store对象。
 store对象对外暴露了dispatch、getState、subscribe方法
 store对象通过getState() 获取内部状态
 initialState为 store 的初始状态，如果不传则为undefined
 store对象通过reducer来修改内部状态
 store对象创建的时候，内部会主动调用dispatch({ type: ActionTypes.INIT });
 来对内部状态进行初始化。
 通过断点或者日志打印就可以看到，store对象创建的同时，reducer就会被调用进行初始化。
 * 
 */
function createStore(reducer, preloadedState, enhancer) {
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState
        preloadedState = undefined
    }

    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
            throw new Error('Expected the enhancer to be a function.')
        }

        return enhancer(createStore)(reducer, preloadedState)
    }

    if (typeof reducer !== 'function') {
        throw new Error('Expected the reducer to be a function.')
    }

    var currentReducer = reducer
    var currentState = preloadedState
    var currentListeners = []
    var nextListeners = currentListeners
    var isDispatching = false

    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice()//复制一份
        }
    }


    function getState() {
        return currentState
    }


    function subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new Error('Expected listener to be a function.')
        }

        var isSubscribed = true

        ensureCanMutateNextListeners()
        nextListeners.push(listener)

        return function unsubscribe() {
            if (!isSubscribed) {
                return
            }

            isSubscribed = false

            ensureCanMutateNextListeners()
            var index = nextListeners.indexOf(listener)
            nextListeners.splice(index, 1)
        }
    }


    function dispatch(action) {
        if (!avalon.isPlainObject(action)) {
            avalon.error('Actions 必须是一个朴素的JS对象')
        }

        if (typeof action.type !== 'string') {
            avalon.error('action必须定义type属性')
        }



        if (isDispatching) {
            avalon.error('Reducers may not dispatch actions.')
        }

        try {
            isDispatching = true
            currentState = currentReducer(currentState, action)
        } finally {
            isDispatching = false
        }

        var listeners = currentListeners = nextListeners
        for (var i = 0; i < listeners.length; i++) {
            listeners[i]()
        }

        return action
    }

    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param {Function} nextReducer The reducer for the store to use instead.
     * @returns {void}
     */
    function replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
            throw new Error('Expected the nextReducer to be a function.')
        }

        currentReducer = nextReducer
        dispatch({type: ActionTypes.INIT})
    }

    /**
     * Interoperability point for observable/reactive libraries.
     * @returns {observable} A minimal observable of state changes.
     * For more information, see the observable proposal:
     * https://github.com/zenparsing/es-observable
     */


    // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.
    dispatch({type: ActionTypes.INIT})

    return {
        dispatch: dispatch,
        subscribe: subscribe,
        getState: getState,
        replaceReducer: replaceReducer
                // [$$observable]: observable
    }
}

module.exports = createStore