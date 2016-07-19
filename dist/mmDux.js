(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mmDux"] = factory();
	else
		root["mmDux"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	if(typeof avalon !== 'function'){
	    throw 'mmDux need avalon2'
	}
	var createStore = __webpack_require__(1)
	var combineReducers = __webpack_require__(2)
	var bindActionCreator = __webpack_require__(3)
	var applyMiddleware = __webpack_require__(4)
	var compose = __webpack_require__(5)

	module.exports = {
	    createStore: createStore,
	    combineReducers: combineReducers,
	    bindActionCreator: bindActionCreator,
	    applyMiddleware: applyMiddleware,
	    compose: compose
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var createStore = __webpack_require__(1)
	/*
	 * 
	 * 将一个reducer map转换为一个reducer。方便对复杂的reducer进行功能拆分。
	 */

	function getUndefinedStateErrorMessage(key, action) {
	    var actionType = action && action.type
	    var actionName = actionType && '"' + actionType.toString() + '"' || 'an action'

	    return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.'
	}

	function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
	    var reducerKeys = Object.keys(reducers)
	    var argumentName = action && action.type === createStore.ActionTypes.INIT ?
	            'initialState argument passed to createStore' :
	            'previous state received by the reducer'

	    if (reducerKeys.length === 0) {
	        return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.'
	    }

	    if (!avalon.isPlainObject(inputState)) {
	        return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"')
	    }

	    var unexpectedKeys = Object.keys(inputState).filter(function (key) {
	        return !reducers.hasOwnProperty(key)
	    })

	    if (unexpectedKeys.length > 0) {
	        return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') +
	                ' ' + ('"' + unexpectedKeys.join('", "') + 
	                '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.')
	    }
	}

	function assertReducerSanity(reducers) {
	    Object.keys(reducers).forEach(function (key) {
	        var reducer = reducers[key]
	        var initialState = reducer(undefined, {type: createStore.ActionTypes.INIT})

	        if (typeof initialState === 'undefined') {
	            throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.')
	        }

	        var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.')
	        if (typeof reducer(undefined, {type: type}) === 'undefined') {
	            throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.')
	        }
	    })
	}


	function combineReducers(reducers) {
	    var reducerKeys = Object.keys(reducers)
	    var finalReducers = {}, finalReducerKeys = []
	    for (var i = 0; i < reducerKeys.length; i++) {
	        var key = reducerKeys[i]
	        if (typeof reducers[key] === 'function') {
	            finalReducers[key] = reducers[key]
	            finalReducerKeys.push(key)
	        }
	    }

	    var sanityError
	    try {
	        assertReducerSanity(finalReducers)
	    } catch (e) {
	        sanityError = e
	    }

	    return function combination(state, action) {
	        state = avalon.isObject(state) ? state : {}

	        if (sanityError) {
	            throw sanityError
	        }

	        if (true) {
	            var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action)
	            if (warningMessage) {
	                avalon.warn(warningMessage)
	            }
	        }

	        var hasChanged = false
	        var nextState = {}
	        for (var i = 0; i < finalReducerKeys.length; i++) {
	            var key = finalReducerKeys[i]
	            var reducer = finalReducers[key]
	            var previousStateForKey = state[key]
	            var nextStateForKey = reducer(previousStateForKey, action)
	            if (typeof nextStateForKey === 'undefined') {
	                var errorMessage = getUndefinedStateErrorMessage(key, action)
	                throw new Error(errorMessage)
	            }
	            nextState[key] = nextStateForKey
	            hasChanged = hasChanged || nextStateForKey !== previousStateForKey
	        }
	        return hasChanged ? nextState : state
	    }
	}

	module.exports = combineReducers

/***/ },
/* 3 */
/***/ function(module, exports) {

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var compose = __webpack_require__(5)
	function applyMiddleware() {
	    var middlewares = avalon.slice(arguments)


	    return function (createStore) {
	        return function (reducer, initialState, enhancer) {
	            var store = createStore(reducer, initialState, enhancer)
	            var _dispatch = store.dispatch
	            var chain = []

	            var middlewareAPI = {
	                getState: store.getState,
	                dispatch: function (action) {
	                    return _dispatch(action)
	                }
	            }
	            chain = middlewares.map(function (middleware) {
	                return middleware(middlewareAPI)
	            })
	            _dispatch = compose.apply(0, chain)(store.dispatch)

	            return avalon.mix({}, store, {
	                dispatch: _dispatch
	            })
	        }
	    }
	}

	module.exports = applyMiddleware

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = function compose() {
	    var fns = avalon.slice(arguments)


	    if (fns.length === 0) {
	        return function (arg) {
	            return arg
	        }
	    } else {
	        var _ret = function () {
	            var last = fns[fns.length - 1]
	            var rest = fns.slice(0, -1)
	            return {
	                v: function () {
	                    return reduceRight(rest, function (composed, f) {
	                        return f(composed)
	                    }, last.apply(undefined, arguments))
	                }
	            }
	        }()

	        if (typeof _ret === "object")
	            return _ret.v
	    }
	}

	function reduceRight(ary, callback /*, initialValue*/) {
	    if (ary.reduceRight) {
	        return ary.reduceRight.apply(ary, avalon.slice(arguments,1))
	    }
	    if ('function' !== typeof callback) {
	        throw new TypeError(callback + ' is not a function')
	    }
	    var t = Object(ary), len = t.length >>> 0, k = len - 1, value
	    if (arguments.length >= 3) {
	        value = arguments[2]
	    } else {
	        while (k >= 0 && !(k in t)) {
	            k--
	        }
	        if (k < 0) {
	            throw new TypeError('Reduce of empty array with no initial value')
	        }
	        value = t[k--]
	    }
	    for (; k >= 0; k--) {
	        if (k in t) {
	            value = callback(value, t[k], k, t)
	        }
	    }
	    return value
	}


/***/ }
/******/ ])
});
;