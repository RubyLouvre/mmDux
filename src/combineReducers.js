var createStore = require('./createStore')
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
        var initialState = reducer(undefined, {type: _createStore.ActionTypes.INIT})

        if (typeof initialState === 'undefined') {
            throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.')
        }

        var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.')
        if (typeof reducer(undefined, {type: type}) === 'undefined') {
            throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.')
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