if(typeof avalon !== 'function'){
    throw 'mmDux need avalon2'
}
var createStore = require('./createStore')
var combineReducers = require('./combineReducers')
var bindActionCreator = require('./bindActionCreator')
var applyMiddleware = require('./applyMiddleware')
var compose = require('./compose')

module.exports = {
    createStore: createStore,
    combineReducers: combineReducers,
    bindActionCreator: bindActionCreator,
    applyMiddleware: applyMiddleware,
    compose: compose
}