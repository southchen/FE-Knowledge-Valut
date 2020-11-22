[TOC]

# useReducer

## Start from `reducer`

关于 `reducer` 最重要的一点就是：**它每次只返回一个值**。`reducer` 的工作就是减少。那个值可以是数字，字符串，对象，数组或者对象，但是它总是一个值。`reducer` 在很多情况下都很有效，但是他对于处理输入一组值，返回一个值的情况非常有用。

reducer 与 useReducer 这两者之间有巨大的相似之处。

| reduce in JavaScript                            | useReducer in React                                       |
| ----------------------------------------------- | --------------------------------------------------------- |
| `array.reduce(reducer, initialValue)`           | `useReducer(reducer, initialState)`                       |
| `singleValue = reducer(accumulator, itemValue)` | `newState = reducer(currentState, action)`                |
| reduce method returns a single value            | useReducer returns a pair of values. [newState, dispatch] |

## The `useReducer` API

它接收一个形如`（state, action） => newState`的`reducer`,并返回当前的`state`以及与其配套的`dispatch`方法 (**状态**和**调度函数**)。

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

> 第三个参数 `init` 是可选值，可以用来惰性提供初始状态。使用一个 `init` 函数来计算初始状态/值，而不是显式的提供值。如果初始值可能会不一样，这会很方便，最后会用计算的值来代替初始值。

为了使它工作，我们需要做一些事情：

- 定义初始状态
- 提供一个包含 `action` 的函数来更新 `state`
- 触发 `useReducer` ，基于初始值计算并更新 `state` 。
- the `reducer` is responsible for what the `dispatch` function does. `reducer`  is called with whatever `dispatch` is called with.

```js
const reducer = (state,action)=>{ 
	//condition flow control applying action
	return state
}

handleClick = ()=>{
  dispatch({type:'add',payLoad:1})
}
```

## Use Case

使用`useReducer`还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递`dispatch`而不是回调函数。

```js
const initialState = {count: 0}
// 定义reducer函数，参数为state值和action动作,想要改变state的特定值的操作都放在reducer中
function reducer(state, action) {
    switch (action.type) {
        case: 'increment':
          return {count: state.count + 1}
        case: 'decrement':
          return {count: state.count - 1}
        default:
          throw new Error()
    }
}

function Counter() {
    // 初始化userReducer,参数为定义好的reducer函数和initialState（初始状态值）
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
      <>
        Count: {state.count}
        // 通过调用dispatch传入action，从而改变state
        <button onClick={() => dispatch({type: 'decrement'})}>-</button>
        <button onClick={() => dispatch({type: 'incerment'})}>+</button>
      </>
    )
}
```

## useState vs useReducer

`useState`只是预置了`reducer`的`useReducer`。源码：

```js
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
```



`useState`传入的参数为初始状态值，`userReducer`传入了`reducer`和初始状态值。 `useState`返回的两个值`count`和`setCount`，`userReducer`返回的两个值为`state`和 `dispatch`。

如果`Reducer Hook`的返回值与当前`state`相同，`React`将跳过子组件的渲染及副作用的执行。

### How to chose

- 如果 state 的类型为 Number, String, Boolean 建议使用 useState，如果 state 的类型 为 Object 或 Array，建议使用 useReducer
- 如果 state 变化非常多，也是建议使用 useReducer，集中管理 state 变化，便于维护
- 如果 state 关联变化，建议使用 useReducer
- 业务逻辑如果很复杂，也建议使用 useReducer
- 如果 state 只想用在 组件内部，建议使用 useState，如果想维护全局 state 建议使用 useReducer

| Scenario                    | useState                | useReducer             |
| --------------------------- | ----------------------- | ---------------------- |
| Type of state               | Number, String, Boolean | Object or Array        |
| Number of state transitions | 1 or 2                  | Too many               |
| Related state transitions   | No                      | Yes                    |
| Business logic              | No business logic       | Complex business logic |
| local vs global             | local                   | global                 |

**当你一个元素中的状态，依赖另一个元素中的状态，最好使用 `useReducer`**

### implement useState with useReducer

```javascript
const useStateReducer = (prevState, newState) =>
 typeof newState === 'function' ? newState(prevState) : newState

const useStateInitializer = initialValue =>
  typeof initialValue === 'function' ? initialValue() : initialValue

function useState(initialValue) {
 return React.useReducer(useStateReducer, initialValue, useStateInitializer)
}
```



 

## use with typescript

useReducer 可以认为是简配版的redux，可以让我们把复杂、散落在四处的useState，setState 集中到 reducer中统一处理。类似我们同样可以从reducer 函数(state逻辑处理函数)中推断出useReducer 返回的 state 和 dispatch 的 action类型，所以无需在显示的声明，参考如下实例：

```js
type ReducerAction =
    | { type: 'switchToSmsLogin' | 'switchToAccountLogin' }
    | {
        type: 'changePwdAccount' | 'changeSmsAccount';
        payload: {
            actualAccount: string;
            displayAccount: string;
        };
    };

interface AccountState {
    loginWithPwd: boolean;
    pwdActualAccount: string;
    pwdDisplayAccount: string;
    smsActualAccount: string;
    smsDisplayAccount: string;
}

function loginReducer(loginState: AccountState, action: ReducerAction): AccountState {
    switch (action.type) {
        case 'switchToAccountLogin':
            return {
                ...loginState,
                pwdActualAccount: loginState.smsActualAccount,
                pwdDisplayAccount: loginState.smsDisplayAccount,
                loginWithPwd: !loginState.loginWithPwd,
            };
        // 密码登陆页账号发生变化
        case 'changePwdAccount':
            return {
                ...loginState,
                pwdActualAccount: action.payload.actualAccount,
                pwdDisplayAccount: action.payload.displayAccount,
            };
        default:
            return loginState;
    }
}

// 可以从 loginReducer 推断出
// loginState 的类型 满足 AccountState interface
// dispatchLogin 接受的参数满足 ReducerAction 类型
const [loginState, dispatchLogin] = useReducer(loginReducer, initialState);

dispatchLogin({ type: 'switchToAccountLogin' });
dispatchLogin({
    type: 'changePwdAccount',
    payload: {
        actualAccount,
        displayAccount,
    },
});

// 错误： 不能将 logout 类型赋值给 type
dispatchLogin({ type: 'logout' });
// 错误： { type: 'changePwdAccount' } 类型缺少 payload属性
dispatchLogin({ type: 'changePwdAccount' });

```

### 

