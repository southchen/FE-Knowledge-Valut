[toc]

### jsx and jsxFactory

```json
{
  "compilerOptions": {
    ...
    "jsx": "react",
    ...
}
```

Other values for this are `react-native` if you work with React Native, and `preserve`, if you want to keep JSX as it is. `preserve` makes sense if you want to compile it later with Babel or a predefined setup. If you want to use TypeScript and JSX with libraries like Preact, Vue or Dojo (they all speak JSX!), you can define a specific JSX factory:

```json
{
  "compilerOptions": {
    ...
    "jsx": "react",
    "jsxFactory": "h",
    ...
}
```

This uses the respective virtual DOM implementation of said libraries (`h`) instead of `React.createElement`.

# JSX in React-TS

```tsx
// @jsx React.createElement
import React from 'react'

// @jsx h
import { h } from 'preact'
```

- for "intrinsic" element constructors (lower-case tag name), it looks if a property with that same key exists under `JSX.IntrinsicElements`.
- for function element constructors, it checks if its return type is assignable to the `JSX.Element` interface.
- for class-based element constructors, it checks if its instance type is assignable to the `JSX.ElementClass` interface.

```tsx
namespace JSX {
  interface IntrinsicElements {
    a: HTMLAttributes<HTMLAnchorElement>
    button: HTMLAttributes<HTMLButtonElement>
    div: HTMLAttributes<HTMLElement>
    span: HTMLAttributes<HTMLElement>
  }
  
  interface Element {
    key?: string
    type: string | (() => any)
    props: { [propName: string]: any }
  }
}
```

```tsx
function MyComponent(props: any) {
  return {
    type: MyComponent,
    props: props
  }
}
```

Then you have a valid constructor! Because its return type is assignable to `JSX.Element`:

```tsx
const myFunctionElement = <MyComponent /> // good to go!
```

TypeScript will treat any JSX expression's type to be the same type as `JSX.Element`

```tsx
function MyComponent() {
  return <div>Hi!</div>
}

const myFunctionElement = <MyComponent /> // still okay

const nakedElement = <div>hi!</div>
type NakedElementType = typeof nakedElement // the type is JSX.Element
```

```tsx
function MyStringFragment() {
  return ['a', 'b', 'c'] as any as JSX.Element
}

const myFragment = <MyStringFragment /> // good now!
```

In summary: before we even talk about props, TypeScript has to check if a component is actually a valid JSX constructor, otherwise it rejects it when you try to use it in a JSX expression.

# Typing JSX children

TypeScript provides a way to typecheck the nested JSX expressions against the **element attributes type**. The element attributes type is the type of all attributes added to a JSX expression, i.e. it's the type of the object passed into the second parameter in `React.createElement`.

```tsx
namespace JSX {
  interface ElementChildrenAttribute {
    enfants: {} // 'children' in french
  }
}
```

And you have a component defined like so:

```tsx
interface Props {
  enfants?: JSX.Element | JSX.Element[]
  children?: string | string[]
}

function MyComponent(props: Props) { 
  return <div>{props.enfants}</div>
}
```

Then the following will happen:

```tsx
// error! the type `string` is not assignable 
// to the type `JSX.Element | JSX.Element[]` for the `enfants` attribute
const myComponentElement1 = <MyComponent>hello world!</MyComponent>

// good! `enfants` is of type `JSX.Element` which is assignable
// to itself or on array of itself
const myComponentElement2 = (
  <MyComponent>
    <MyComponent />
  </MyComponent>
)
```

So this is TypeScript's way of defining a connection between nested JSX and some property in the interface that you declare.



for an anchor element, the available attributes you can give an `<a />` tag equivalent to `JSX.IntrinsicElements['a']`:

```tsx
interface AnchorProps {
  children?: ReactNode
  className?: string
  id?: string
  onClick?(event: MouseEvent<HTMLAnchorElement>): void
  ref?: { current?: HTMLAnchorElement }
}

declare const props: AnchorProps

const myAnchor = <a {...props} />
```

We can use following types for annotating `children`:

- `ReactNode` | `ReactChild` | `ReactElement`
- `object` | `{[key:string]:unknown}` | `MyModel`
- primitives `string` | `number` | `boolean`
- `Array<T>` where T can be any of former
- `never` | `null` | `undefined` ( null and undefined doesn't make much sense though )

```ts
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
}
type JSXElementConstructor<P> =
        | ((props: P) => ReactElement | null)
        | (new (props: P) => Component<P, any>);

```

A `ReactNode` type can be a `ReactElement`, a `string`, a `number`, or even `null`, among other types.

```tsx
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;

type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
```

 Incidentally, React’s class components render method return type is `ReactNode`.

```
render(): ReactNode;
```

React’s functional components return either a `ReactElement` or `null`.

```tsx
type FC<P = {}> = FunctionComponent<P>;

interface FunctionComponent<P = {}> { //return ReactElement|null
        (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
        propTypes?: WeakValidationMap<P>;
        contextTypes?: ValidationMap<any>;
        defaultProps?: Partial<P>;
        displayName?: string;
}
```



 `ReactElement` inherits directly into `JSX.Element` interface, which in turn, inherits to `JSX.IntrinsicElements`.

This last one is very interesting since it defines the HTML that will be transpiled from JSX code (similar to what TypeScript does with `HTMLElements`, `HTMLInputElement`, and the like).

React 不但能渲染 HTML 标签（strings）也能渲染 React 组件（classes）。JavaScript 触发这些的原理是不同的（`React.createElement('div')` vs `React.createElement(MyComponent)`）， 确定使用哪一种方式取决于首字母的大小写，`foo` 被认为是 HTML 标签，`Foo` 被认为是一个组件。

一个 HTML 标签 `foo` 被标记为 `JSX.IntrinsicElements.foo` 类型。

```ts
declare namespace JSX {
  interface IntrinsicElements {
    a: React.HTMLAttributes;
    abbr: React.HTMLAttributes;
    div: React.HTMLAttributes;
    span: React.HTMLAttributes;

    // 其他
  }
}
```



```tsx
enum SelectableButtonTypes {
    Important = "important",
    Optional = "optional",
    Irrelevant = "irrelevant"
}

interface IButtonProps {
    text?: string,
    /** The type of button, pulled from the Enum SelectableButtonTypes */
    type: SelectableButtonTypes,//👈
    action: (selected: boolean) => void
}
    
<ExtendedSelectableButton 
    type={SelectableButtonTypes.Important} //左边
    action={ (selected) => {console.log(selected) }}
    />       
```

## Generic Components

```tsx
interface Props<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>(props: Props<T>) {
  const { items, renderItem } = props;
  const [state, setState] = React.useState<T[]>([]); 
  
  return (
    <div>
      {items.map(renderItem)}
    </div>
  );
}

ReactDOM.render(
  <List
    items={["a", "b"]} // type of 'string' inferred here
    renderItem={item => (
      <li key={item}>
        {item.trim()} //allowed, because we're working with 'strings' all around 
      </li>
    )}
  />,
  document.body
);

ReactDOM.render(
  <List<number>
    items={[1,2,3,4]} 
    renderItem={item => <li key={item}>{item.toPrecision(3)}</li>}
  />,
  document.body
);
```



```tsx
export interface IBorderedBoxProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
}
```

## Event Types

```
import React, { Component, MouseEvent } from 'react';
```

The benefits of using TypeScript here, is that we can also use Generics (like in the previous example) to restrict the elements a particular event handler can be used on.

```tsx
function eventHandler(event: React.MouseEvent<HTMLAnchorElement>) {
    console.log("TEST!")
}

const ExtendedSelectableButton = ({type, action}: IButtonProps) => {
    let [selected, setSelected]  = useState(false)
    return (<button onClick={eventHandler}>{text}</button>)
}

/** This will allow you to use this event handler both, on anchors and button elements */
function eventHandler(event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) {
    console.log("TEST!")
}
```

Events supported are: [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent), [`ChangeEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ChangeEvent), [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent), [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent), [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent), [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent), [`FormEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FormEvent), [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent), [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent), [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent), [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent), [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent), [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent). As well as `SyntheticEvent`, for all other events.

## Restrictive Event Handling[#](https://fettblog.eu/typescript-react/events/#restrictive-event-handling)

If you want to restrict your event handlers to specific elements, you can use a generic to be more specific:

```tsx
handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    alert(event.currentTarget.tagName); // alerts BUTTON
  }
 handleAnotherClick(event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) {
    event.preventDefault();
    alert('Yeah!');
  }
```

