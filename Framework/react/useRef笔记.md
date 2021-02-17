[toc]

## useRef

- 目的：需要一个值在组件不断渲染时**保持不变**。
- 初始化：`const count = useRef(0)`
- 读取：`count.current`
- 为什么需要用`current`？是为了保证两次useRef是同一个值（只有引用可以做到）。
- useRef既可以用来引用DOM对象，也可以用来引用普通对象。

## forwardRef

- 想在函数组件中使用ref，就一定会用到`forwardRef`。
- 在函数组建中，props无法传递ref属性，而`forwardRef`可以多接受一个ref参数，从而实现ref在函数组件中的传递。
- **Ref forwarding是组件一个可选的特征。一个组件一旦有了这个特征，它就能接受上层组件传递下来的ref，然后顺势将它传递给自己的子组件。**
- 通过`forwardRef`可以将`ref`转发到子组件；子组件拿到父组件中创建的`ref`，绑定到自己的某一个元素中；

## useImperativeHandle

```javascript
const ref = useRef()
const createHandle = ()=>{
  return {
    exposedProp:xxx
  }
}
useImperativeHandle(ref, createHandle, [deps]);
```

- ref：定义 current 对象的 ref

- createHandle：一个函数，返回值是一个对象，即这个 ref 的 current

- [deps]：即依赖列表，当监听的依赖发生变化，useImperativeHandle 才会重新将子组件的实例属性输出到父组件

  与React.forwadRef搭配，返回一个由子组件修改后的Ref,传递回父组件方便父组件查询部分值的变化。

- 使用`useImperativeHandle`可以自定义传输的ref值。
- useImperativeHandle 是 hook 中提供的允许我们 ref 一个function component 的方案 
- useImperativeHandle(ref,createHandle,[deps])可以自定义暴露给父组件的实例值。如果不使用，父组件的ref(chidlRef)访问不到任何值（childRef.current==null）

## Example

在下面的例子当中，`<FancyButton>`通过React.forwardRef的赋能，它可以接收上层组件传递下来的ref，并将它传递给自己的子组件-一个原生的DOM元素button：

```react
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 假如你没有通过 React.createRef的赋能，在function component上你是不可以直接挂载ref属性的。
// 而现在你可以这么做了，并能访问到原生的DOM元素:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

通过这种方式，使用了`<FancyButton>`的组件就能通过挂载ref到`<FancyButton>`组件的身上来访问到对应的底层的原生DOM元素了-就像直接访问这个DOM元素一样。

下面我们逐步逐步地来解释一下上面所说的是如何发生的：

1. 我们通过调用React.createRef来生成了一个[React ref](https://reactjs.org/docs/refs-and-the-dom.html)，并且把它赋值给了ref变量。
2. 我们通过手动赋值给`<FancyButton>`的ref属性进一步将这个React ref传递下去。
3. 接着，React又将ref传递给React.forwardRef()调用时传递进来的函数`(props, ref) => ...`。届时，ref将作为这个函数的第二个参数。
4. 在`(props, ref) => ...`组件的内部，我们又将这个ref 传递给了作为UI输出一部分的`<button ref={ref}>`组件。
5. 当`<button ref={ref}>`组件被真正地挂载到页面的时候，，我们就可以在使用`ref.current`来访问真正的DOM元素button了。

注意，上面提到的第二个参数ref只有在你通过调用React.forwardRef()来定义组件的情况下才会存在。普通的function component和 class component是不会收到这个ref参数的。同时，ref也不是props的一个属性。


 通过`useImperativeHandle`的Hook，将传入的ref和`useImperativeHandle`第二个参数返回的对象绑定到了一起所以在父组件中，使用`inputRef.current`时，实际上使用的是返回的对象


```react
import React, { useRef, forwardRef, useImperativeHandle } from 'react';

 const TDInput = forwardRef((props, ref) => {
   const inputRef = useRef();

   useImperativeHandle(ref, () => ({
     focus: () => {
       inputRef.current.focus();
     }
   }), [inputRef])

   return <input ref={inputRef} type="text"/>
 })

 export default function UseImperativeHandleHookDemo() {
   const inputRef = useRef();

   return (
     <div>
       <TDInput ref={inputRef}/>
       <button onClick={e => inputRef.current.focus()}>聚焦</button>
     </div>
   )
 }

```



```react
// 第一步：定义转盘抽奖组件对外暴露的接口 start、stop
export interface WheelHandles {
    startLottery(): void;
    stopLottery(
        luckyIndex: number,
        stopCallback: () => void,
    ): void;
}

// 第二步：将转盘组件声明为 RefForwardingComponent 类型， 可以接受一个 ref props
// ref props 是通过 forwarding-refs 实现
const PrizeWheel: RefForwardingComponent<WheelHandles, Props> = (props, ref): => {

    function startLottery(): void {
        // 开始抽奖逻辑
    }

    function stopLottery(luckyIndex: number, stopCallback: () => void): void {
        // 停止抽奖逻辑
    }

    // 第三步：通过useImperativeHandle实现对外提供预定义好的接口
   
    useImperativeHandle(ref, () => {
        return {
            startLottery,
            stopLottery,
        };
    });

    return (
        // 抽奖组件
    )
}

// 第四步 useRef 引用转盘对象， 并调用 startLottery 开始抽奖
const lotteryRef = useRef<PrizeWheelHandles>(null);

<PrizeWheel
    ref={lotteryRef}
    data={lotteryInfo}
/>

lotteryRef.current.startLottery();
```



## 源码

```typescript
    useImperativeHandle<T>(
      ref: {|current: T | null|} | ((inst: T | null) => mixed) | null | void,
      create: () => T,
      deps: Array<mixed> | void | null,
    ): void {
      currentHookNameInDev = 'useImperativeHandle';
      mountHookTypesDev();
      checkDepsAreArrayDev(deps);
      return mountImperativeHandle(ref, create, deps);
    },
```



```typescript
function imperativeHandleEffect<T>(
  create: () => T,
  ref: {|current: T | null|} | ((inst: T | null) => mixed) | null | void,
) {
  if (typeof ref === 'function') {
    const refCallback = ref;
    const inst = create();
    refCallback(inst);
    return () => {
      refCallback(null);
    };
  } else if (ref !== null && ref !== undefined) {
    const refObject = ref;
    if (__DEV__) {    }
    const inst = create();
    refObject.current = inst;
    return () => {
      refObject.current = null;
    };
  }
}

function mountImperativeHandle<T>(
  ref: {|current: T | null|} | ((inst: T | null) => mixed) | null | void,
  create: () => T,
  deps: Array<mixed> | void | null,
): void {
  if (__DEV__) {  }
  // TODO: If deps are provided, should we skip comparing the ref itself?
  const effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : null;

  return mountEffectImpl(
    UpdateEffect,
    HookLayout,
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps,
  );
}

function updateImperativeHandle<T>(
  ref: {|current: T | null|} | ((inst: T | null) => mixed) | null | void,
  create: () => T,
  deps: Array<mixed> | void | null,
): void {
  if (__DEV__) {  }
  // TODO: If deps are provided, should we skip comparing the ref itself?
  const effectDeps =
    deps !== null && deps !== undefined ? deps.concat([ref]) : null;

  return updateEffectImpl(
    UpdateEffect,
    HookLayout,
    imperativeHandleEffect.bind(null, create, ref),
    effectDeps,
  );
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps): void {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps,
  );
}

```

