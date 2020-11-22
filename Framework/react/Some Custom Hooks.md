# Some Custom Hooks

### useDebounce

用来处理防抖值的 `Hook` 。

示例： `DebouncedValue` 只会在输入结束 `500ms` 后变化。

```typescript
import React,{useState} from "react";
import {useDebounce} from "./customHooks";

function DebounceHook (){
    const [value, setValue] = useState();
    const debouncedValue = useDebounce(value,  500 );
    return (
        <div>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value) }
                placeholder="Typed value"
                style={{ width: 280 }}
            />
            <p style={{ marginTop: 16 }}>DebouncedValue: {debouncedValue}</p>
        </div>
    )
}

export default DebounceHook;

```

实现：

```typescript
  const useDebounceFn = (fn,wait)=>{
      const _wait =  wait || 0;
    
      const timer = useRef();
      const fnRef = useRef(fn);
      fnRef.current = fn;
    
      const cancel = useCallback(()=>{
        if(timer.current){
            clearTimeout(timer.current);
        }
      },[])

      const run = useCallback((...args)=>{
          cancel();
          timer.current = setTimeout(()=>{
            fnRef.current(...args);
          },_wait)
      },[_wait,cancel])

      useEffect(()=> cancel,[]);

      return {
          run,
          cancel
      }
  }

  const useDebounce =(value,wait)=>{
    const [debounced, setDebounced] = useState(value);

    const { run } = useDebounceFn(() => {
        setDebounced(value);
      }, wait);
    
      useEffect(() => {
        run();
      }, [value]);
    
      return debounced;
  }

```

解析：

- `useDebounce` 收到 `value` 值变化时，会调用 `useEffect` 钩子；
- `useEffect` 钩子调用 `run` 方法，也就是 `useDebounceFn` 这个钩子返回的；
- `run` 方法中实现了防抖的核心功能。

### useThrottle

用来处理节流值的 `Hook` 。节流的处理，一定时间内只触发一次。

示例： `ThrottledValue` 每隔 `500ms` 变化一次。

```typescript
import React,{useState} from "react";
import {useThrottle} from "./customHooks";

function ThrottleHook (){
    const [value, setValue] = useState();
    const throttledValue = useThrottle(value,  500 );
    return (
        <div>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Typed value"
                style={{ width: 280 }}
            />
            <p style={{ marginTop: 16 }}>throttledValue: {throttledValue}</p>
        </div>
    )
}

export default ThrottleHook;

```

实现：

```typescript
  const useThrottleFn = (fn,wait)=>{
    const _wait =  wait || 0;
    const timer = useRef();
    const fnRef = useRef(fn);
    fnRef.current = fn;

    const currentArgs = useRef([]);

    const cancel = useCallback(()=>{
      if(timer.current){
          clearTimeout(timer.current);
      }
      timer.current = undefined;
    },[])

    const run = useCallback((...args)=>{
        currentArgs.current = args;
        if(!timer.current){
            timer.current = setTimeout(()=>{
                fnRef.current(...args);
                timer.current = undefined;
            },_wait)
        }   
    },[_wait,cancel])

    useEffect(()=> cancel,[]);

    return {
        run,
        cancel
    }
}

const useThrottle =(value,wait)=>{
    const [throttled, setThrottled] = useState(value);

    const { run } = useThrottleFn(() => {
        setThrottled(value);
      }, wait);
    
      useEffect(() => {
        run();
      }, [value]);
    
      return throttled;
}

```

解析：

- `useThrottle` 收到 `value` 值变化时，会调用 `useEffect` 钩子；
- `useEffect` 钩子调用 `run` 方法，也就是 `useThrottleFn` 这个钩子返回的；
- `run` 方法中实现了节流的核心方法，每次判断定时器是否开启，如果没有开启则开启定时器执行函数；
- 因此不论输入频率多快，都是每隔一定时间才会触发函数的执行。