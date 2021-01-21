[toc]

# Hooks

## UseState

```tsx
const [user, setUser] = React.useState<IUser | null>(null);

// later...
setUser(newUser);
```

## UseReducer

```js
const initialState = {count: 0};

type ACTIONTYPE = 
  | { type: 'increment', payload: number} 
  | { type: 'decrement', payload: string} 


function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + action.payload};
    case 'decrement':
      return {count: state.count - Number(action.payload)};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement', payload: '5'})}>-</button>
      <button onClick={() => dispatch({type: 'increment', payload: 5})}>+</button>
    </>
  );
}
```

Redux

```tsx
import { Reducer } from 'redux';

export function reducer: Reducer<AppState, Action>() {}
```

## useRef

```tsx
const ref1 = useRef<HTMLElement>(null!);
const ref2 = useRef<HTMLElement | null>(null);
```

The first option will make `ref1.current` read-only, and is intended to be passed in to built-in `ref` attributes that React will manage (because React handles setting the `current` value for you).

`null!` is a non-null assertion operator (the `!`). It asserts that any expression before it is not `null` or `undefined`, so if you have `useRef<HTMLElement>(null!)` it means that you're instantiating the ref with a current value of `null` but lying to TypeScript that it's not `null`.

```tsx
function MyComponent() {
  const ref1 = useRef<HTMLElement>(null!);
  useEffect(() => {
    doSomethingWith(ref1.current); // TypeScript won't require null-check e.g. ref1 && ref1.current
  });
  return <div ref={ref1}> etc </div>;
}
```

The second option will make `ref2.current` mutable, and is intended for "instance variables" that you manage yourself.

```tsx
function TextInputWithFocusButton() {
  // initialise with null, but tell TypeScript we are looking for an HTMLInputElement
  const inputEl = React.useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    // strict null checks need us to check if inputEl and current exist.
    // but once current exists, it is of type HTMLInputElement, thus it
    // has the method focus! ✅
    if (inputEl && inputEl.current) {
      inputEl.current.focus();
    }
  };
  return (
    <>
      {/* in addition, inputEl only can be used with input elements. Yay! */}
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

## Custom Hooks

[TS 3.4 const assertions](https://devblogs.microsoft.com/typescript/announcing-typescript-3-4/#const-assertions):

```tsx
export function useLoading() {
  const [isLoading, setState] = React.useState(false);
  const load = (aPromise: Promise<any>) => {
    setState(true);
    return aPromise.finally(() => setState(false));
  };
  return [isLoading, load] as const; 
    // infers [boolean, typeof load] 
    //instead of (boolean | typeof load)[]
}
```



```tsx
function tuplify<T extends any[]>(...elements: T) {
  return elements;
}

function useArray() {
  const numberValue = useRef(3).current;
  const functionValue = useRef(() => {}).current;
  return [numberValue, functionValue]; // type is (number | (() => void))[]
}

function useTuple() {
  const numberValue = useRef(3).current;
  const functionValue = useRef(() => {}).current;
  return tuplify(numberValue, functionValue); // type is [number, () => void]
}
```

# Basic Prop Types Examples

### Props without children

```js
type AppProps = {
  message: string;
  count: number;
  disabled: boolean;
  /** array of a type! */
  names: string[];
  /** string literals to specify exact string values, with a union type to join them together */
  status: "waiting" | "success";
  /** any object as long as you dont use its properties (NOT COMMON but useful as placeholder) */
  obj: object;
  obj2: {}; // almost the same as `object`, exactly the same as `Object`
  /** an object with any number of properties (PREFERRED) */
  obj3: {
    id: string;
    title: string;
  };
  /** array of objects! (common) */
  objArr: {
    id: string;
    title: string;
  }[];
  /** a dict object with any number of properties of the same type */
  dict1: {
    [key: string]: MyTypeHere;
  };
  dict2: Record<string, MyTypeHere>; // equivalent to dict1
  /** any function as long as you don't invoke it (not recommended) */
  onSomething: Function;
  /** function that doesn't take or return anything (VERY COMMON) */
  onClick: () => void;
  /** function with named prop (VERY COMMON) */
  onChange: (id: number) => void;
  /** alternative function type syntax that takes an event (VERY COMMON) */
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  /** an optional prop (VERY COMMON!) */
  optional?: OptionalType;
};
```

### Props with Children

```tsx
export declare interface AppProps {
  children1: JSX.Element; // bad, doesnt account for arrays
  children2: JSX.Element | JSX.Element[]; // meh, doesn't accept strings
  children3: React.ReactChildren; // despite the name, not at all an appropriate type; it is a utility
  children4: React.ReactChild[]; // better
  children: React.ReactNode; // best, accepts everything
  functionChildren: (name: string) => React.ReactNode; // recommended function as a child render prop type
  style?: React.CSSProperties; // to pass through style props
  onChange?: React.FormEventHandler<HTMLInputElement>; // form events! the generic parameter is the type of event.target
  props: Props & React.PropsWithoutRef<JSX.IntrinsicElements["button"]>; // to impersonate all the props of a button element without its ref
}
```

`React.createElement` always returns an object, which is the `JSX.Element` interface, but `React.ReactNode` is the set of all possible return values of a component.

- `JSX.Element` -> Return value of `React.createElement`
- `React.ReactNode` -> Return value of a component

```tsx
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;

```

```
 onChange = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ text: e.currentTarget.value });
  };
```

```
  onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    this.setState({text: e.currentTarget.value})
  }
```

The first method uses an inferred method signature `(e: React.FormEvent<HTMLInputElement>): void` and the second method enforces a type of the delegate provided by `@types/react`. So `React.ChangeEventHandler<>` is simply a "blessed" typing by `@types/react`, whereas you can think of the inferred method as more... *artisanally hand-rolled*. Either way it's a good pattern to know. 



```js
<form
  ref={formRef}
  onSubmit={(e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    const email = target.email.value; // typechecks!
    const password = target.password.value; // typechecks!
    // etc...
  }}
>
  <div>
    <label>
      Email:
      <input type="email" name="email" />
    </label>
  </div>
  <div>
    <label>
      Password:
      <input type="password" name="password" />
    </label>
  </div>
  <div>
    <input type="submit" value="Log in" />
  </div>
</form>
```

# Context

```js
interface AppContextInterface {
  name: string;
  author: string;
  url: string;
}

const AppCtx = React.createContext<AppContextInterface | null>(null);

```

Using `React.createContext` with an empty object as default value.

```js
interface ContextState {
  // set the type of state you want to handle with context e.g.
  name: string | null;
}
//set an empty object as default state
const Context = React.createContext({} as ContextState);
// set up context provider as you normally would in JavaScript [React Context API](https://reactjs.org/docs/context.html#api)
```

We can write a helper function called createCtx that guards against accessing a Context whose value wasn't provided. By doing this, API instead, we never have to provide a default and never have to check for undefined:

```js

import * as React from "react";

/**
 * A helper to create a Context and Provider with no upfront default value, and
 * without having to check for undefined all the time.
 */
function createCtx<A extends {} | null>() {
  const ctx = React.createContext<A | undefined>(undefined);
  function useCtx() {
    const c = React.useContext(ctx);
    if (c === undefined)
      throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

// Usage:

// We still have to specify a type, but no default!
export const [useCurrentUserName, CurrentUserProvider] = createCtx<string>();

function EnthusasticGreeting() {
  const currentUser = useCurrentUserName();
  return <div>HELLO {currentUser.toUpperCase()}!</div>;
}

function App() {
  return (
    <CurrentUserProvider value="Anders">
      <EnthusasticGreeting />
    </CurrentUserProvider>
  );
}
```

**Type Guarding**

```
interface Admin {
  role: string;
}
interface User {
  email: string;
}

function isAdmin(user: Admin | User): user is Admin {
  return (user as any).role !== undefined;
}
```

## Infer

**User-Defined Type Guards**:

```tsx
function isString(a: unknown): a is string {
  return typeof a === "string";
}
```

```tsx
  type T1 = { name: string };
  type T2 = { age: number };
  
  type UnionToIntersection<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
  type T3 = UnionToIntersection<{ a: (x: T1) => void; b: (x: T2) => void }>; // T1 & T2

 type lk= T1&T2
  type kk = T1|T2
  let a :lk = {name:'1',age:1}
  let b :kk = {name:'1',age:2}
  console.log(a,b)
```

The key thing to remember here is as far as TypeScript is concerned, `functions are just callable objects with no key`:

```typescript
type pickCard = {
  (x: { suit: string; card: number }[]): number;
  (x: number): { suit: string; card: number };
  // no need for combined signature in this form
  // you can also type static properties of functions here eg `pickCard.wasCalled`
};
```

## typeof

```tsx
const [state, setState] = React.useState({
  foo: 1,
  bar: 2,
}); // state's type inferred to be {foo: number, bar: number}

const someMethod = (obj: typeof state) => {
  // grabbing the type of state even though it was inferred
  // some code using obj
  setState(obj); // this works
};
```

```tsx
import { Button } from "library"; // but doesn't export ButtonProps! oh no!
type ButtonProps = React.ComponentProps<typeof Button>; // no problem! grab your own!
type AlertButtonProps = Omit<ButtonProps, "onClick">; // modify
const AlertButton: React.FC<AlertButtonProps> = (props) => (
  <Button onClick={() => alert("hello")} {...props} />
);
```

```typescript
function foo() {
  return {
    a: 1,
    b: 2,
    subInstArr: [
      {
        c: 3,
        d: 4,
      },
    ],
  };
}

type InstType = ReturnType<typeof foo>;
type SubInstArr = InstType["subInstArr"];
type SubIsntType = SubInstArr[0];

let baz: SubIsntType = {
  c: 5,
  d: 6, // type checks ok!
};
```

## Utility

```
typeof and instanceof: type query used for refinement
keyof: get keys of an object
O[K]: property lookup
[K in O]: mapped types
+ or - or readonly or ?: addition and subtraction and readonly and optional modifiers
x ? Y : Z: Conditional types for generic types, type aliases, function parameter types
!: Nonnull assertion for nullable types
=: Generic type parameter default for generic types
as: type assertion
is: type guard for function return types
```

```tsx
ConstructorParameters: a tuple of class constructor's parameter types
Exclude: exclude a type from another type
Extract: select a subtype that is assignable to another type
InstanceType: the instance type you get from a newing a class constructor
NonNullable: exclude null and undefined from a type
Parameters: a tuple of a function's parameter types
Partial: Make all properties in an object optional
Readonly: Make all properties in an object readonly
ReadonlyArray: Make an immutable array of the given type
Pick: A subtype of an object type with a subset of its keys
Record: A map from a key type to a value type
Required: Make all properties in an object required
ReturnType A function's return type
```



## Wrapping/Mirroring a HTML Element

Usecase: you want to make a `<Button>` that takes all the normal props of `<button>` and does extra stuff.

Strategy: extend `React.ComponentProps<'button'>`

```tsx
export interface ButtonProps extends React.ComponentProps<"button"> {
  specialProp?: string;
}
export function Button(props: ButtonProps) {
  const { specialProp, ...rest } = props;
  // do something with specialProp
  return <button {...rest} />;
}
```

There are at least 2 other equivalent ways to do this:

```tsx
// Method 1: JSX.IntrinsicElements
type btnType = JSX.IntrinsicElements["button"]; // cannot inline or will error
export interface ButtonProps extends btnType {} // etc

// Method 2: React.[Element]HTMLAttributes
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
```

## Generic components with children

wrap the type of the props in React.PropsWithChildren (this is what React.FC<> does):

```

interface WrapperProps<T> {
  item: T;
  renderItem: (item: T) => React.ReactNode;
}

const Wrapper = <T extends {}>(
  props: React.PropsWithChildren<WrapperProps<T>>
) => {
  return (
    <div>
      {props.renderItem(props.item)}
      {props.children}
    </div>
  );
};
```

## Typing Children

```tsx
type OneChild = React.ReactElement;
type TwoChildren = [React.ReactElement, React.ReactElement];
type ArrayOfProps = SomeProp[];
type NumbersChildren = number[];
type TwoNumbersChildren = [number, number];
```



### Gurading component

```tsx
// Button props
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};

// Anchor props
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
};

// Input/output options
type Overload = {
  (props: ButtonProps): JSX.Element;
  (props: AnchorProps): JSX.Element;
};

// Guard to check if href exists in props
const hasHref = (props: ButtonProps | AnchorProps): props is AnchorProps =>
  "href" in props;

// Component
const Button: Overload = (props: ButtonProps | AnchorProps) => {
  // anchor render
  if (hasHref(props)) return <a {...props} />;
  // button render
  return <button {...props} />;
};
```

Components, and JSX in general, are analogous to functions. When a component can render differently based on their props, it's similar to how a function can be overloaded to have multiple call signatures. In the same way, you can overload a function component's call signature to list all of its different "versions".

```tsx
type ButtonProps = JSX.IntrinsicElements['button'];
type AnchorProps = JSX.IntrinsicElements['a'];

// optionally use a custom type guard
function isPropsForAnchorElement(
  props: ButtonProps | AnchorProps
): props is AnchorProps {
  return "href" in props;
}
```

## Discriminated Union Types:

```tsx
type UserTextEvent = {
  type: "TextEvent";
  value: string;
  target: HTMLInputElement;
};
type UserMouseEvent = {
  type: "MouseEvent";
  value: [number, number];
  target: HTMLElement;
};
type UserEvent = UserTextEvent | UserMouseEvent;
function handle(event: UserEvent) {
  if (event.type === "TextEvent") {
    event.value; // string
    event.target; // HTMLInputElement
    return;
  }
  event.value; // [number, number]
  event.target; // HTMLElement
}
```

