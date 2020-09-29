## Ref

```tsx
function createRef<T>(): RefObject<T>;
```

所以上面创建引用时，显式指定它的类型。

```
- private inputRef = React.createRef();
+ private inputRef = React.createRef<HTMLInputElement>();
```

第二个问题是即使在 `componentDidMount` 生命周期中使用，TypeScript 仍然提示 `current` 的值有可能为空。上面讨论过，其实此时我们知道它不可能为空的。但因为 TypeScript 无法理解 `componentDidMount`，所以它不知道此时引用其实是可以安全使用的。解决办法当然是加上判空的逻辑。

```
  componentDidMount() {
+    if(this.inputRef.current){
      this.inputRef.current.focus();
+    }
  }
```

还可通过变量后添加 `!` 操作符告诉 TypeScript 该变量此时非空。

```
  componentDidMount() {
-      this.inputRef.current.focus();
+      this.inputRef.current!.focus();
  }
```

## forwardRef

```tsx
function forwardRef<T, P = {}>(Component: RefForwardingComponent<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
```

可以看到，方法接收两个类型参数，`T` 为需要引用的元素类型，我们示例中是 `HTMLInputElement`，`P` 为组件的 props 类型。

所以添加引用传递后，`FancyInput` 组件在 TypeScript 中的版本应该长这样：

```tsx
const FancyInput = React.forwardRef<HTMLInputElement, {}>((props, ref) => {
  return <input type="text" ref={ref} className="fancy-input" />;
});
```

如果编译器不能够去除 `null`或 `undefined`，你可以使用类型断言手动去除。 语法是添加 `!`后缀： `identifier!`从 `identifier`的类型里去除了 `null`和 `undefined`