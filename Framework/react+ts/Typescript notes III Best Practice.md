[toc]

# Typescript notes III Best Practice

## discriminated union types

假设你有一个表示 AJAX 请求过程的 UI 状态。它要么处于初始状态（initial），要么处于挂起状态（pending），要么处于完成状态（complete），要么处于错误状态（error）。只有在完成状态下才有响应，否则为 null。

```tsx
type AjaxState<T> = {
  state: 'initial' | 'pending' | 'complete' | 'error';
  response: T | null;
}

function getAjaxState( ajaxState: AjaxState<number[]> ) {
  if (ajaxState.state === 'complete') {
    // (property) response: number[] | null
    // Object is possibly 'null'.(2531)
    console.log(ajaxState.response.length); // Error
  }
}
```

虽然我们知道当请求的状态为 `complete` 时，响应对象不会为 null，但 TypeScript 并无法感知这些，所以我们还需要使用非空断言 `ajaxState.response!.length` 来忽略空值并使编译器警告无效。对于这种场景，其实有一个更好的解决方案，即使用可辨识联合：

```typescript
type AjaxState<T> = 
  { state: 'initial'|'pending'|'error', response: null } |
  { state: 'complete', response: T };

function getAjaxState( ajaxState: AjaxState<number[]> ) {
  if (ajaxState.state === 'complete') {
    console.log(ajaxState.response.length);
  }
}
```

通过引入可辨识联合类型，我们把为 null 和非 null 的响应完美的区分开来，还避免了再次使用非空断言，此外还大大提高了程序的可读性。在 TypeScript 实际项目的开发过程中，除了使用非空断言（!）之外，读者还可以使用 TypeScript 3.7 版本中新引入的可选链运算符（?.）和空值合并运算符（??）来提高程序的可读性。

## Using Generics for Precise Prop Types

```ts
type OptionValue = string | number; //after initialataes with string it cannot be assigned with a number

type Option = {
  value: OptionValue;
  label: string;
};

type Props = {
  options: Option[];
  value: OptionValue;
  onChange: (value: OptionValue) => void;
};


```

use generic:

```tsx
type OptionValue = string | number;

type Option<T extends OptionValue> = {
  value: T;
  label: string;
};
```

Now that the `Option` type is generic, we have to specify a type argument when using it for the `options` prop within our `Props` type. This, in turn, means that we should make `Props` generic as well. Again, we'll introduce a generic type parameter `T` and use it for the `value` and `onChange` props:

```tsx
type Props<T extends OptionValue> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};
```

```tsx
//make the component generic as well
function Select<T extends OptionValue>(props: Props<T>) {
  function handleOnChange(e: React.FormEvent<HTMLSelectElement>) {
    const { selectedIndex } = e.currentTarget;
    const selectedOption = props.options[selectedIndex];
    props.onChange(selectedOption.value);
  }
  return (
    <select value={props.value} onChange={handleOnChange}>
      {props.options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
```

## The use of unkonw type

Reading JSON from `localStorage`

Let's assume we want to write a function that reads a value from `localStorage` and deserializes it as JSON. If the item doesn't exist or isn't valid JSON, the function should return an error result; otherwise, it should deserialize and return the value.

Since we don't know what type of value we'll get after deserializing the persisted JSON string, we'll be using `unknown` as the type for the deserialized value. This means that callers of our function will have to do some form of checking before performing operations on the returned value (or resort to using type assertions).

```tsx
type Result =
  | { success: true, value: unknown }
  | { success: false, error: Error };

function tryDeserializeLocalStorageItem(key: string): Result {
  const item = localStorage.getItem(key);

  if (item === null) {
    // The item does not exist, thus return an error result
    return {
      success: false,
      error: new Error(`Item with key "${key}" does not exist`)
    };
  }

  let value: unknown;

  try {
    value = JSON.parse(item);
  } catch (error) {
    // The item is not valid JSON, thus return an error result
    return {
      success: false,
      error
    };
  }

  // Everything's fine, thus return a success result
  return {
    success: true,
    value
  };
}
```

Callers of the `tryDeserializeLocalStorageItem` function have to inspect the `success` property before attempting to use the `value` or `error` properties:

```ts
const result = tryDeserializeLocalStorageItem("dark_mode");

if (result.success) {
  // We've narrowed the `success` property to `true`,
  // so we can access the `value` property
  const darkModeEnabled: unknown = result.value;

  if (typeof darkModeEnabled === "boolean") {
    // We've narrowed the `unknown` type to `boolean`,
    // so we can safely use `darkModeEnabled` as a boolean
    console.log("Dark mode enabled: " + darkModeEnabled);
  }
} else {
  // We've narrowed the `success` property to `false`,
  // so we can access the `error` property
  console.error(result.error);
}
```

