# Functional component and UseEffect

函数式组件捕获了渲染所用的值。（Function components capture the rendered values.）

## 引用 vs 闭包capture value

class Component this.state是对state的引用，所以永远可以取到最新值。

每一次渲染都有它自己的 Props and State。在任意一次渲染中，props和state是始终保持不变的。如果props和state在不同的渲染中是相互独立的，那么使用到它们的任何值也是独立的（包括事件处理函数）。在组件内什么时候去读取props或者state是无关紧要的。因为它们不会改变。在单次渲染的范围内，props和state始终保持不变。（解构赋值的props使得这一点更明显。）

hooks中，每次取到的值是当次渲染时的值。*effect 函数本身*在每一次渲染中都不相同。

如果想在useeffect的回调函数里读取最新的值而不是捕获的值。最简单的实现方法是使用refs，但需要注意的是当你想要从*过去*渲染中的函数里读取*未来*的props和state，你是在逆潮而动。

在React中props和state（被强烈推荐）是不可变的，消除了闭包的缺陷。this是，而且永远是，可变(mutable)的。在函数式组件中，你也可以拥有一个在所有的组件渲染帧中共享的可变变量，ref。

## 依赖

如果你设置了依赖项，effect中用到的所有组件内的值都要包含在依赖中。这包括props，state，函数 — 组件内的任何东西。

一般建议把不依赖props和state的函数提到你的组件外面，并且把那些仅被effect使用的函数放到effect里面。如果这样做了以后，你的effect还是需要用到组件内的函数（包括通过props传进来的函数），可以在定义它们的地方用useCallback包一层。

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

此处为什么要用到 `count`？能否避免对其直接使用？
有一个最佳实践：状态变更时，应该通过 setState 的函数形式来代替直接获取当前状态。

```JS
setCount(c => c + 1);
```

可以把 `count` 通过 ref 保存起来。

```
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

如果useEffect的依赖为空，只会执行一次。但increase函数已被重建，useEffect中取得的increase是最开始的。

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

如果把increase放入deps中

- `increase` 的变化会导致频繁地绑定事件监听，以及解除事件监听。
- 需求是只在组件 mount 时执行一次 `useEffect`，但是 `increase` 的变化会导致 `useEffect` 多次执行，不能满足需求。

```js
function Counter() {
  const [count, increase] = useCount();

  useEffect(() => {
    const handleClick = () => {
      increase(); //每次effect执行，可以拿到useCount返回的新increase
    };

    document.body.addEventListener("click", handleClick);
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [increase]); //👈每次increase被重建，effect执行一次

  return <h1>{count}</h1>;
}
```

solution 1：通过 setState 回调，让函数不依赖外部变量。

useCount中：

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

solution 2：通过 ref 来保存可变变量。

```JS
export const useCount = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  });

  const [increase, decrease] = useMemo(() => {
    const increase = () => {
      setCount(countRef.current + 1);
    };

    const decrease = () => {
      setCount(countRef.current - 1);
    };
    return [increase, decrease];
  }, []); // 保持依赖数组为空，这样 increase 和 decrease 方法都只会被创建一次

  return [count, increase, decrease];
};

```

## 优化

只在effects中传递最小的信息会很有帮助。类似于setCount(c => c + 1)这样的更新形式比setCount(count + 1)传递了更少的信息，因为它不再被当前的count值“污染”。它只是表达了一种行为（“递增”）。

依赖改变时，重新执行函数，但避免重复创建函数。

```javascript
function Counter() {
 const [count, setCount] = useState(0);

 useEffect(() => {
 const id = setInterval(() => {
 setCount(c => c + 1);//函数式更新，不依赖count
 }, 1000);
 return () => clearInterval(id);
 }, []);//setInterval初始化执行一次

 return <h1>{count}</h1>;
}
```

多个state，使用useReducer

**当你想更新一个状态，并且这个状态更新依赖于另一个状态的值时，你可能需要用`useReducer`去替换它们。**

当你写类似`setSomething(something => ...)`这种代码的时候，也许就是考虑使用reducer的契机。reducer可以让你**把组件内发生了什么(actions)和状态如何响应并更新分开表述。**

React会保证dispatch在组件的声明周期内保持不变。所以上面例子中不再需要重新订阅定时器。

```javascript
function Counter() {
 const [state, dispatch] = useReducer(reducer, initialState);
 const { count, step } = state;

 useEffect(() => {
 const id = setInterval(() => {
 dispatch({ type: "tick" });
 }, 1000);
 return () => clearInterval(id);
 }, [dispatch]);//👈只依赖了一个dispatch函数，不关心reducer中如何更新

 return <h1>{count}</h1>;
}

function reducer(state, action) {
 switch (action.type) {
 case "tick":
 return {
 ...state,
 count: state.count + state.step
 };
 }
}
```

本质是让函数与数据解耦，函数只管发出指令，而不需要关心使用的数据被更新时，需要重新初始化自身。

useReducer可以把更新逻辑和描述发生了什么分开。

为了准确地依赖，最佳是将useEffect函数定义在内部

依赖为空[]，说明在我们的effect中确实没有再使用组件范围内的任何东西。

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

如果我们后面修改 `getFetchUrl`去使用`query`状态，我们更可能会意识到我们正在effect里面编辑它 - 因此，我们需要把`query`添加到effect的依赖里：

```jsx
function SearchResults() {
  const [query, setQuery] = useState('react');

  useEffect(() => {
    function getFetchUrl() {
      return '<https://hn.algolia.com/api/v1/search?query=>' + query;    }

    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, [query]); // ✅ Deps are OK在query改变后去重新请求数据是合理的。
  // ...
}
```



第一个， **如果一个函数没有使用组件内的任何值，你应该把它提到组件外面去定义，然后就可以自由地在effects中使用：**

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

你不再需要把它设为依赖，因为它们不在渲染范围内，因此不会被数据流影响。它不可能突然意外地依赖于props或state。

或者， 你也可以把它包装成 `[useCallback` Hook]

```jsx
function SearchResults() {
  const [query, setQuery] = useState('react');

  // ✅ Preserves identity until query changes
  const getFetchUrl = useCallback(() => {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, [query]);  // ✅ Callback deps are OK

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
  }, [query]);  // ✅ Callback deps are OK

  return <Child fetchData={fetchData} />
}

function Child({ fetchData }) {
  let [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, [fetchData]); // ✅ Effect deps are OK

  // ...
}
```

使用useCallback，函数完全可以参与到数据流中。我们可以说如果一个函数的输入改变了，这个函数就改变了。如果没有，函数也不会改变。感谢周到的useCallback，属性比如props.fetchData的改变也会自动传递下去。	



但当多个effect函数时，使用useCallback提取到外部：

```js
function Counter() {
 const [count, setCount] = useState(0);

 const getFetchUrl = useCallback(() => {
 return "https://v?query=" + count;
 }, [count]);//函数自己维护自己的依赖

 useEffect(() => {
 getFetchUrl();
 }, [getFetchUrl]);//只依赖函数本身

 return <h1>{count}</h1>;
}
```

`useEffect` 对业务的抽象非常方便：

1. 依赖项是查询参数，那么 `useEffect` 内可以进行取数请求，那么只要查询参数变化了，列表就会自动取数刷新。注意我们将取数时机从触发端改成了接收端。
2. 当列表更新后，重新注册一遍拖拽响应事件。也是同理，依赖参数是列表，只要列表变化，拖拽响应就会重新初始化，这样我们可以放心的修改列表，而不用担心拖拽事件失效。
3. 只要数据流某个数据变化，页面标题就同步修改。同理，也不需要在每次数据变化时修改标题，而是通过 `useEffect` “监听” 数据的变化，这是一种 **“控制反转”** 的思维。

进一步提取到组件外部，支持跨组件复用->自定义hooks

```js
function useFetch(count, step) {
 return useCallback(() => {
 const url = "https://v/search?query=" + count + "&step=" + step;
 }, [count, step]);
}
function Parent() {
 const [count, setCount] = useState(0);
 const [step, setStep] = useState(0);
 const [other, setOther] = useState(0);
 const fetch = useFetch(count, step); // 封装了 useFetch

 useEffect(() => {
 fetch();
 }, [fetch]);

 return (
 <div>
 <button onClick={() => setCount(c => c + 1)}>setCount {count}</button>
 <button onClick={() => setStep(c => c + 1)}>setStep {step}</button>
 <button onClick={() => setOther(c => c + 1)}>setOther {other}</button>
 </div>
 );
}
```

👆仍存在一个问题：count和step变，导致useCallback重新创建一个函数，没有必要。

可以将依赖转化为ref，在useEffect中更新其.current的值。并封装成自定义hook

```js
function useEventCallback(fn, dependencies) {
 const ref = useRef(null);

 useEffect(() => {
 ref.current = fn;
 }, [fn, ...dependencies]);

 return useCallback(() => {
 const fn = ref.current;
 return fn();
 }, [ref]);
}
```