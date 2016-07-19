var compose = require('./compose')
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