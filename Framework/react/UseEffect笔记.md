[toc]

# Functional component and UseEffect

> 函数式组件捕获了渲染所用的值。（Function components capture the rendered values.）

## 引用 vs 闭包 captured value

class Component this.state 是对 state 的引用，所以永远可以取到最新值。

每一次渲染都有它自己的 Props and State。在任意一次渲染中，props 和 state 是始终保持不变的。如果 props 和 state 在不同的渲染中是相互独立的，那么使用到它们的任何值也是独立的（包括事件处理函数）。在组件内什么时候去读取 props 或者 state 是无关紧要的。因为它们不会改变。在单次渲染的范围内，props 和 state 始终保持不变。（解构赋值的 props 使得这一点更明显。）

hooks 中，每次取到的值是当次渲染时的值。*effect 函数本身*在每一次渲染中都不相同。

- Function component 中可以获得最新值，使用 ref（一个在所有的组件渲染帧中共享的可变变量）

- Class component 中也可以获得快照值，class 里通过触发异步之前保存快照即可。

在 React 中 props 和 state（被强烈推荐）是不可变的，消除了闭包的缺陷。this 是，而且永远是，可变(mutable)的。

## 触发重渲染的几种情况

- 父组件 rerender 则子组件 re-render
- this.setState or setState
- this.forceUpdate
- 祖先组件 context 变

## 依赖

如果你设置了依赖项，effect 中用到的所有组件内的值都要包含在依赖中。这包括 props，state，函数 etc. 组件内的任何东西。

一般建议把不依赖 props 和 state 的函数提到你的组件外面，并且把那些仅被 effect 使用的函数放到 effect 里面。如果这样做了以后，你的 effect 还是需要用到组件内的函数（包括通过 props 传进来的函数），可以在定义它们的地方用 useCallback 包一层。

```JS
const [count, setCount] = useState(0);

useEffect(() => {
    const id = setInterval(() => {
        setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
}, [count]);

```

如果我们频繁修改 `count`，每次执行 Effect，上一次的计时器被清除，需要调用 `setInterval` 重新进入时间队列，实际的定期时间被延后，甚至有可能根本没有机会被执行。

`count` 变化时，我们并不希望重新 `setInterval`，故 deps 为空数组。这意味着该 hook 只在组件挂载时运行一次。Effect 中明明依赖了 `count`，但我们撒谎说它没有依赖，那么当 `setInterval` 回调函数执行时，获取到的 `count` 值永远为 0。

**此处为什么要用到 `count`？能否避免对其直接使用？即不依赖外部变量**

### 函数式更新

```JS
setCount(c => c + 1);
```

#### 函数式更新解决依赖函数问题

在 useCount Hook 中， count 状态的改变会让 useMemo 中的 increase 和 decrease 函数被重新创建。

```JS
export const useCount = () => {
  const [count, setCount] = useState(0);//👈闭包

  const [increase, decrease] = useMemo(() => {
    const increase = () => {
      setCount(count + 1);
    };

    const decrease = () => {
      setCount(count - 1);
    };
    return [increase, decrease];
  }, [count]);//一旦count更新，increase，decrease函数重建，包含一个闭包中count是新值

  return [count, increase, decrease];
};

```

由于闭包特性，如果这两个函数被其他 Hook 用到了，我们应该将这两个函数也添加到相应 Hook 的依赖数组中，否则就会产生 bug。

如果 useEffect 的依赖为空，只会执行一次。但 increase 函数已被重建，useEffect 中取得的 increase 是最开始的。

```JS
function Counter() {
  const [count, increase] = useCount();

  useEffect(() => {
    const handleClick = () => {
      increase(); // 执行后 count 的值永远都是 1
    };//useEffect中取到的increase函数的闭包中count：0

    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, []); //👈

  return <h1>{count}</h1>;
}

```

如果把 increase 放入 deps 中

- `increase` 的变化会导致频繁地绑定事件监听，以及解除事件监听。
- 需求是只在组件 mount 时执行一次 `useEffect`，但是 `increase` 的变化会导致 `useEffect` 多次执行，不能满足需求。

```js
function Counter() {
  const [count, increase] = useCount();

  useEffect(() => {
    const handleClick = () => {
      increase(); //每次effect执行，可以拿到useCount返回的新increase
    };

    document.body.addEventListener('click', handleClick);
    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, [increase]); //👈每次increase被重建，effect执行一次

  return <h1>{count}</h1>;
}
```

通过 setState 回调，让函数不依赖外部变量。

```JS
export const useCount = () => {
  const [count, setCount] = useState(0);

  const [increase, decrease] = useMemo(() => {
    const increase = () => {
      setCount((latestCount) => latestCount + 1);
    };

    const decrease = () => {
      setCount((latestCount) => latestCount - 1);
    };
    return [increase, decrease];
  }, []); // 保持依赖数组为空，这样 increase 和 decrease 方法都只会被创建一次

  return [count, increase, decrease];
};

```

依赖改变时，重新执行函数，但避免重复创建函数。

但函数式更新拿不到新的 props。‼️

### 使用 ref.current 更新

```js
const [count, setCount] = useState(0);
const countRef = useRef();
countRef.current = count;

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current);
  }, 1000);
  return () => clearInterval(id);
}, []);
```

### 多个 state，使用 useReducer

**当你想更新一个状态，并且这个状态更新依赖于另一个状态的值时，你可能需要用`useReducer`去替换它们。**

当你写类似`setSomething(something => ...)`这种代码的时候，也许就是考虑使用 reducer 的契机。reducer 可以让你**把组件内发生了什么(actions)和状态如何响应并更新分开表述。**

React 会保证 dispatch 在组件的声明周期内保持不变。所以上面例子中不再需要重新订阅定时器。

```javascript
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]); //👈只依赖了一个dispatch函数，不关心reducer中如何更新

  return <h1>{count}</h1>;
}

function reducer(state, action) {
  switch (action.type) {
    case 'tick':
      return {
        ...state,
        count: state.count + state.step,
      };
  }
}
```

本质是让函数与数据解耦，函数只管发出指令，而不需要关心使用的数据被更新时，需要重新初始化自身。

useReducer 可以把更新逻辑和描述发生了什么分开。

## useEffect 中的函数

方案 1： 如果这个函数没有使用组件内的任何值，把它提到组件外面去定义

方案 2：如果这个函数只是在某个 effect 里面用到，把它定义到 effect 里面 ƒ

为了准确地依赖，最佳是将 useEffect 函数定义在内部

依赖为空[]，说明在我们的 effect 中确实没有再使用组件范围内的任何东西。

```JSX
function SearchResults() {
  // ...
  useEffect(() => {
    // We moved these functions inside!
    function getFetchUrl() {
      return 'https://hn.algolia.com/api/v1/search?query=react';
    }
    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, []); // ✅ Deps are OK
  // ...
}
```

如果我们后面修改 `getFetchUrl`去使用`query`状态，我们更可能会意识到我们正在 effect 里面编辑它 - 因此，我们需要把`query`添加到 effect 的依赖里：

```jsx
function SearchResults() {
  const [query, setQuery] = useState('react');

  useEffect(() => {
    function getFetchUrl() {
      return '<https://hn.algolia.com/api/v1/search?query=>' + query;
    }

    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, [query]); // ✅ Deps are OK在query改变后去重新请求数据是合理的。
  // ...
}
```

如果要依赖函数， **如果一个函数没有使用组件内的任何值，你应该把它提到组件外面去定义，然后就可以自由地在 effects 中使用：**

```JS
// ✅ Not affected by the data flow
function getFetchUrl(query) {
  return 'https://hn.algolia.com/api/v1/search?query=' + query;
}

function SearchResults() {
  useEffect(() => {
    const url = getFetchUrl('react');
    // ... Fetch data and do something ...
  }, []); // ✅ Deps are OK

  useEffect(() => {
    const url = getFetchUrl('redux');
    // ... Fetch data and do something ...
  }, []); // ✅ Deps are OK

  // ...
}
```

你不再需要把它设为依赖，因为它们不在渲染范围内，因此不会被数据流影响。它不可能突然意外地依赖于 props 或 state。

或者， 你也可以把它包装成 `[useCallback` Hook]

useCallback，它就是解决将函数抽到 useEffect 外部的问题。

```jsx
function SearchResults() {
  const [query, setQuery] = useState('react');

  // ✅ Preserves identity until query changes
  const getFetchUrl = useCallback(() => {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, [query]); // ✅ Callback deps are OK

  useEffect(() => {
    const url = getFetchUrl();
    // ... Fetch data and do something ...
  }, [getFetchUrl]); // ✅ Effect deps are OK

  // ...
}
```

`useCallback`本质上是添加了一层依赖检查。它以另一种方式解决了问题 - **我们使函数本身只在需要的时候才改变，而不是去掉对函数的依赖。**

这正是拥抱数据流和同步思维的结果。**对于通过属性从父组件传入的函数这个方法也适用：**

```jsx
function Parent() {
  const [query, setQuery] = useState('react');

  // ✅ Preserves identity until query changes
  const fetchData = useCallback(() => {
    const url = 'https://hn.algolia.com/api/v1/search?query=' + query;
    // ... Fetch data and return it ...
  }, [query]); // ✅ Callback deps are OK

  return <Child fetchData={fetchData} />;
}

function Child({ fetchData }) {
  let [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]); // ✅ Effect deps are OK

  // ...
}
```

使用 useCallback，函数完全可以参与到数据流中。我们可以说如果一个函数的输入改变了，这个函数就改变了。如果没有，函数也不会改变。感谢周到的 useCallback，属性比如 props.fetchData 的改变也会自动传递下去。

使用 useCallback 提取到外部：

```js
function Counter() {
  const [count, setCount] = useState(0);

  const getFetchUrl = useCallback(() => {
    return 'https://v?query=' + count;
  }, [count]); //函数自己维护自己的依赖

  useEffect(() => {
    getFetchUrl();
  }, [getFetchUrl]); //只依赖函数本身

  return <h1>{count}</h1>;
}
```

`useEffect` 对业务的抽象非常方便：

1. 依赖项是查询参数，那么 `useEffect` 内可以进行取数请求，那么只要查询参数变化了，列表就会自动取数刷新。注意我们将取数时机从触发端改成了接收端。
2. 当列表更新后，重新注册一遍拖拽响应事件。也是同理，依赖参数是列表，只要列表变化，拖拽响应就会重新初始化，这样我们可以放心的修改列表，而不用担心拖拽事件失效。
3. 只要数据流某个数据变化，页面标题就同步修改。同理，也不需要在每次数据变化时修改标题，而是通过 `useEffect` “监听” 数据的变化，这是一种 **“控制反转”** 的思维。

进一步提取到组件外部，支持跨组件复用->自定义 hooks

### 使用 useCallback+ref 封装

父组件传给子组件一个 function，子组件的 useEffect 中调用该函数，desp 中依赖了该函数。

则每次父组件每次更新 re-render，函数本身不变，但每次创建新的引用，子组件 effect 都会随着被触发。

- 子组件 useEffect 的 deps 必须有该函数，否则将只会在 mount 时执行一次 sideeffect，'Don't lie to deps'

- Solution1: 将 deps 替换为一个 flag，标志着 effect 是否需要被执行。但 function 可能因为闭包而一直使用一个 stale 值。

- Solution2：使用 useCallback 包裹该函数，将 deps 转移到 useCallback 的 deps 中。把 effect 强刷的控制逻辑从 callee 转移到了 caller。但有时 props 不可控，可能为第三方 or 其他组件中传入。且 useCallback 不能做语义保障。

- solution 3: useEventCallback，引入 ref，用 ref.current 保存传入的 fn，当依赖项变化时重新赋值。再返回一个 useCallback 包裹的函数，依赖 ref，每次更新时拿到 ref 的最新 current，并执行。

  ```js
  // child
  useEventCallback(() => {
    fetchData().then((result) => {
      setResult(result);
    });
  }, [fetchData]);
  function useEventCallback(fn, dependencies) {
    const ref = useRef(() => {
      throw new Error('Cannot call an event handler while rendering.');
    });

    useEffect(() => {
      ref.current = fn;
    }, [fn, ...dependencies]);

    return useCallback(() => {
      const fn = ref.current;
      return fn();
    }, [ref]); //关于ref使用，可参考dan写的useInterval文章
  }
  ```

- Solution 4：使用 useReducer，将副作用逻辑移动到 reducer 中，react 保证了 dispatch 的不变性，可以作为依赖传入子组件。但 useReducer 没有原生支持异步。
- Solution5： 如果可能将被依赖的变量提取到组件外。进一步可以封装为 custom hook

## deps 的比较

areHookInputsEqual()

```javascript
function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

const objectIs: (x: any, y: any) => boolean =
  typeof Object.is === 'function' ? Object.is : is;

export default objectIs;
```
