mmDux
=======

mmDux是redux的avalon版本

只是将里面store的observable方法去掉, 里面的辅助函数改成avalon的工具方法

mmDux是一种可预知的状态容器

##Store

store 是一个单一对象：

   1.  管理应用的 state
   2.  通过 store.getState() 可以获取 state
   3.  通过 store.dispatch(action) 来触发 state 更新
   4.  通过 store.subscribe(listener) 来注册 state 变化监听器
   5.  通过 createStore(reducer, [initialState]) 创建

```
var store = mmDux.createStore(function(){
    return {}
})
console.log(store)

```
![](./store.png)

##ActionCreator

action是一个普通的对象，用来描述应用程序中发生的某件事情，
它是应用程序中可以用来描述数据变化的唯一角色。

actionCreator 是一个函数，用来创建一个action：
```javascript
var actionCreator = function() {
    return {
        type: 'AN_ACTION' //注意type值必须全部大写
    }
}
```

##Reducers

Actions用来告诉我们应用程序中有某件事情发生了，但是并不会告诉store这些改变改如何响应，
也不会改变store。这就是Reducers的工作。
```javascript
var reducer = function () {
    console.log('Reducer was called with args', arguments)
}

var store = createStore(reducer)
```

这里的reducer也就是根reducer，但我们可以有多个reducer，他们分别只处理一部分的state。
然后通过combineReducers组成根reducer用来创建一个store, 比如：
```javascript
var userReducer = function (state = {}, action) {
        // etc.
}
var itemsReducer = function (state = [], action) {
        // etc.
}
var reducer = combineReducers({
    user: userReducer,
    items: itemsReducer
})
```

mmDux 的核心思想之一就是，它不直接修改整个应用的状态树，
而是将状态树的每一部分进行拷贝并修改拷贝后的部分，然后将这些部分重新组合成一颗新的状态树。

也就是说，子 reducers 会把他们创建的副本传回给根 reducer，
而根 reducer 会把这些副本组合起来形成一颗新的状态树。最后根 reducer 将新的状态树传回给 store，
store 再将新的状态树设为最终的状态。

Middleware
middleware 其实就是高阶函数，作用于 dispatch 返回一个新的 dispatch（附加了该中间件功能）。
可以形式化为：newDispatch = middleware1(middleware2(...(dispatch)...))。

```
//redux-thunk
function createThunkMiddleware(extraArgument) {
  return function({ dispatch, getState }) {
        return function(next){
            return function(action){
                if (typeof action === 'function') {
                  return action(dispatch, getState, extraArgument);
                }

                return next(action);
            }
        }
     } 

  };
}

var thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

module.exports = thunk

```

