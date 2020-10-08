extends never/[]/object/{} ? ==> A is subtype of never/[]/object/{} ?

```ts
type fromempty<T>=T extends []?true:false
type a= fromempty<[]>//true
type b = fromempty<any[]>//false
```



编写`utility type`时，多多使用`generic constraint`保证实例化时的类型安全

```ts
interface Name {
first: string;
last: string
}
type Pick1<T, K>{
[k in K]: T[k]
}
type FirstLast = Pick1<Name, 'first'| 'last'>
type FirstMiddle = Pick1<Name, 'first', 'middle'> // 应该报错但没报错
type Pick2<T, K extends keyof T> = { // 添加泛型约束
[k in K]: T[K]
}
type FirstMiddle = Pick2<Name, 'first', 'middle'> // 正确的报错了
```

###  Type widening

当你使用一个常量初始化一个变量并且没提供类型标注时， typescript需要为你的变量确定一个类型，这个过程就叫widening 考虑如下代码

mutable location会触发（如let)

```ts
let x = 3 // widening,类型为number
const x = 3 // 不触发weidening,类型为3
```

```
const obj = {
name: 'yj'
} // 推导类型为 { name: string}
```



对于大部分类型使用内置的类型收窄即可，支持的类型收窄操作包括

- Array.isArray
- instanceof
- key in object
- typeof
- falsy 判断

由于Error, Loading,Content等状态实际上是互斥的，因此可以用一个变量通过tagged union来建模状态 重构代码如下

```tsx
interface RequestPending {
  state: 'pending'
}
interface RequestError {
  state: 'error',
  error: string;
}
interface RequestSuccess {
  state: 'ok',
  content: string;
}
type RequestState = RequestError | RequestPending | RequestSuccess

const App = () =>  {
  const [state, setState] = useState<RequestState>({
    state: 'ok',
    content: ''
  })
  function load(){
    setState({
      state: 'pending'
    })
    try {
      const resp = await fetch(getUrlForPage());
      if(!resp.ok){
        throw new Error('unable to load')
      }
      const text = await resp.text();
      setState({
        state: 'ok',
        content: text
      })
    }catch(error){
      setState({
        state: 'error',
        error
      })
    }
  }
  switch(state.type){
    case 'pending':
        return 'pending',
    case 'error':
        return state.error
    case 'ok':
        return <h1>{state.content}</h1>
  }
}
```



保证了循环里的 result[0]和result[1]都不含有undefined|null，防止其影响了 正常的代码判断

```ts
function extent(nums:number[]){
let result: [number,number] | null = null;
for(const num of nums){
if(!result){
  result = [num, num]
}else {
  result = [Math.min(num,result[0]), Math.max(num,result[1])]
}
}
return result;
}
```

### 优先使用 union of interface而非 interfaces of unions

```ts
//bad
interface Layer {
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | PointPaint
}

//good
interface FillLayer {
  type: 'fill',
  layout: FillLayout,
  paint: FillPaint
}
interface LineLayer {
  type: 'line',
  layout: LineLayout,
  paint: LinePaint
}
interface PointLayer {
  type: 'paint',
  layout: PointLayout,
  paint: PointPaint
}

type Layer = FillLayer | LineLayer |PointLayer
```





```ts
interface SuperType {
    base: string;
}
interface SubType extends SuperType {
    addition: string;
};

// subtype compatibility
let superType: SuperType = { base: 'base' };
let subType: SubType = { base: 'myBase', addition: 'myAddition' };
superType = subType;

// Covariant
type Covariant<T> = T[];
let coSuperType: Covariant<SuperType> = [];
let coSubType: Covariant<SubType> = [];
coSuperType = coSubType;

// Contravariant --strictFunctionTypes true
type Contravariant<T> = (p: T) => void;
let contraSuperType: Contravariant<SuperType> = function(p) {}
let contraSubType: Contravariant<SubType> = function(p) {}
contraSubType = contraSuperType;

// Bivariant --strictFunctionTypes false
type Bivariant<T> = (p: T) => void;
let biSuperType: Bivariant<SuperType> = function(p) {}
let biSubType: Bivariant<SubType> = function(p) {}
// both are ok
biSubType = biSuperType;
biSuperType = biSubType;

// Invariant --strictFunctionTypes true
type Invariant<T> = { a: Covariant<T>, b: Contravariant<T> };
let inSuperType: Invariant<SuperType> = { a: coSuperType, b: contraSuperType }
let inSubType: Invariant<SubType> = { a: coSubType, b: contraSubType }
// both are not ok
inSubType = inSuperType;
inSuperType = inSubType;
```

我们将基础类型叫做`T`，复合类型叫做`Comp<T>`：

- 协变 *(Covariant)*：协变表示`Comp<T>`类型兼容和`T`的一致。
- 逆变 *(Contravariant)*：逆变表示`Comp<T>`类型兼容和`T`相反。
- 双向协变 *(Covariant)*：双向协变表示`Comp<T>`类型双向兼容。
- 不变 *(Bivariant)*：不变表示`Comp<T>`双向都不兼容。

基本上所有用 interface 表达的类型都有其等价的 type 表达。但我在实践的过程中，也发现了一种类型只能用 interface 表达，无法用 type 表达，那就是往函数上挂载属性。


```ts
interface FuncWithAttachment {  (
    param: string): boolean;  s
omeProperty: number;}
const testFunc: FuncWithAttachment = ...;
const result = testFunc('mike');  // 有类型提醒testFunc.someProperty = 3;  // 有类型提醒 
```

#### 环境 Ambient Modules

在实际应用开发时有一种场景，当前作用域下可以访问某个变量，但这个变量并不由开发者控制。例如通过 Script 标签直接引入的第三方库 CDN、一些宿主环境的 API 等。这个时候可以利用 TS 的环境声明功能，来告诉 TS 当前作用域可以访问这些变量，以获得类型提醒。

具体有两种方式，declare 和三斜线指令。


```ts
declare const IS_MOBILE = true;  // 编译后此行消失const wording = IS_MOBILE ? '移动端' : 'PC端'; 
```


用三斜线指令可以一次性引入整个类型声明文件。


```ts
/// <reference path="../typings/monaco.d.ts" />const range = new monaco.Range(2, 3, 6, 7); 
```

#### 复合类型

TypeScript 的复合类型可以分为两类：**set** 和 **map**。set 是指一个无序的、无重复元素的集合。而 map 则和 JS 中的对象一样，是一些没有重复键的键值对。

```ts
// set
type Size = 'small' | 'default' | 'big' | 'large';
// map
interface IA {
    a: string
    b: number
}
```

#### 复合类型间的转换

```ts
// map => set
type IAKeys = keyof IA;    // 'a' | 'b'
type IAValues = IA[keyof IA];    // string | number
 
// set => map
type SizeMap = {
    [k in Size]: number
}
// 等价于
type SizeMap2 = {
    small: number
    default: number
    big: number
    large: number
}
```

#### 映射类型和同态变换

在 TypeScript 中，有以下几种常见的映射类型。它们的共同点是只接受一个传入类型，生成的类型中 key 都来自于 keyof 传入的类型，value 都是传入类型的 value 的变种。

```ts
type Partial<T> = { [P in keyof T]?: T[P] }    // 将一个map所有属性变为可选的
type Required<T> = { [P in keyof T]-?: T[P] }    // 将一个map所有属性变为必选的
type Readonly<T> = { readonly [P in keyof T]: T[P] }    // 将一个map所有属性变为只读的
type Mutable<T> = { -readonly [P in keyof T]: T[P] }    // ts标准库未包含，将一个map所有属性变为可写的
```

此类变换，在 TS 中被称为同态变换。在进行同态变换时，TS 会先复制一遍传入参数的属性修饰符，再应用定义的变换。

由 set 生成 map

```ts

type Record<K extends keyof any, T> = { [P in K]: T };
 
type Size = 'small' | 'default' | 'big';
/*
{
    small: number
    default: number
    big: number
}
 */
type SizeMap = Record<Size, number>;
```

map 保留删除：Pick Omit

set保留删除：Exclude Extract

`never` 是 `|` 运算的幺元，即 `x | never = x`。

`typeof` 用于获取一个 “常量” 的类型，这里的 “常量” 是指任何可以在编译期确定的东西，例如 const、function、class 等。它是从 **实际运行代码** 通向 **类型系统** 的单行道。理论上，任何运行时的符号名想要为类型系统所用，都要加上 typeof。但是 class 比较特殊不需要加，因为 ts 的 class 出现得比 js 早，现有的为兼容性解决方案。

在使用 class 时，`class 名`表示实例类型，`typeof class` 表示 class 本身类型。没错，这个关键字和 js 的 typeof 关键字重名了 :)。



我在项目中遇到这样一种场景，需要获取一个类型中所有 value 为指定类型的 key。例如，已知某个 React 组件的 props 类型，我需要 “知道”（编程意义上）哪些参数是 function 类型。


```ts
interface SomeProps {  
    a: string  
    b: number  
    c: (e: MouseEvent) => void  
    d: (e: TouchEvent) => void
}
// 如何得到 'c' \| 'd' ？ 
```


分析一下这里的思路，我们需要从一个 map 得到一个 set，而这个 set 是 map 的 key 的**子集**，筛选子集的**条件**是 value 的类型。要构造 set 的子集，需要用到 `never`；要实现条件判断，需要用到 `extends`；而要实现 key 到 value 的访问，则需要索引取值。经过一些尝试后，解决方案如下。


```ts
type GetKeyByValueType<T, Condition> = {  
	[K in keyof T]: T[K] extends Condition ? K : never
}[keyof T]; 
type FunctionPropNames = GetKeyByValueType<SomeProps, Function>;  // 'c' \| 'd' |
```


这里的运算过程如下：


```ts
// 开始
{
    a: string  
    b: number  
    c: (e: MouseEvent) => void  
    d: (e: TouchEvent) => void
}
// 第一步，条件映射
{  a: never  b: never  c: 'c'  d: 'd'}
 // 第二步，索引取值
 never | never | 'c' | 'd'
 // never的性质
 'c' | 'd' 
```

Ref: [TypeScript 中高级应用与最佳实践](http://www.alloyteam.com/2019/07/13796/)



```TS
let strictTypeHeaders: { [key: string]: string } = {};
let header: object = {};
header = strictTypeHeaders; // OK.
strictTypeHeaders = header; // Error
```

空类型：`{}`。它描述了一个没有成员的对象。当你试图访问这样一个对象的任意属性时，TypeScript 会产生一个编译时错误：

```
// Type {}
const obj = {};

// Error: Property 'prop' does not exist on type '{}'.
obj.prop = "semlinker";
```

但是，你仍然可以使用在 Object 类型上定义的所有属性和方法，这些属性和方法可通过 JavaScript 的原型链隐式地使用：

```
// Type {}
const obj = {};

// "[object Object]"
obj.toString();

const pt = {} as Point; 
pt.x = 3;
pt.y = 4; // OK
```

Unknown

这个类型仅可以执行有限的操作（`==、=== 、||、&&、?、!、typeof、instanceof` 等等），其他操作需要向 `Typescript` 证明这个值是什么类型，否则会提示异常。

`{}` 表示的非 null，非 undefined 的任意类型。

```ts
declare function create(o: {}): void;

create({ prop: 0 }); // OK
create(null); // Error
create(undefined); // Error
create(42); // OK
create("string"); // OK
create(false); // OK
create({
  toString() {
    return 3;
  },
}); // OK

```

```ts
const enum ActiveType {
  active = 1,
  inactive = 2,
}

function isActive(type: ActiveType) {}
isActive(ActiveType.active);

// ============================== compile result:
// function isActive(type) { }
// isActive(1 /* active */);

ActiveType[1]; // Error
ActiveType[10]; // Error

```

`enum` 中括号索引取值的方式容易出错，相对 `enum`，`const enum` 是更安全的类型。

`enum` 在 Typescript 中有一定的特殊性（有时表示类型，又是表示值），如果要获取 `enum` 的 key 类型，需要先把它当成值，用 `typeof` 再用 `keyof`。

```ts
// 表示类型扩展
interface A {
  a: string
}

interface B extends A { // { a: string, b: string }
  b: string
}

// 条件类型中起到布尔运算的功能
type Bar<T> = T extends string ? 'string' : never
type C = Bar<number> // never
type D = Bar<string> // string
type E = Bar<'fooo'> // string

```

使 `A extends B` 在布尔运算或泛型限制中成立的条件是 `A` 是 `B` 的子集，也就是 `A` 需要比 `B` 更具体，至少是跟 `B` 一样。



#### Record

`Record` 定义键类型为 `Keys`、值类型为 `Values` 的对象类型。

示例：

```ts
enum ErrorCodes {
  Timeout = 10001,
  ServerBusy = 10002,
  
}

const ErrorMessageMap: Record<ErrorCodes, string> = {
  [ErrorCodes.Timeout]: 'Timeout, please try again',
  [ErrorCodes.ServerBusy]: 'Server is busy now'
}
复制代码
```

类型映射还可以用来做全面性检查，例如上面的例子中如果漏了某个 ErrorCodes，Typescript 同样会抛出异常。

```ts
enum ErrorCodes {
  Timeout = 10001,
  ServerBusy = 10002,
  AuthFailed = 10003
}

// 类型 "{ 10001: string; 10002: string; }" 中缺少属性 "10003"，但类型 "Record<ErrorCodes, string>" 中需要该属性
const ErrorMessageMap: Record<ErrorCodes, string> = { 
  [ErrorCodes.Timeout]: 'Timeout, please try again',
  [ErrorCodes.ServerBusy]: 'Server is busy now'
}
复制代码
```

代码实现：

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

#### Matching only objects without properties

If we want to enforce that an object has no properties, we can use the following trick (credit: [Geoff Goodman](https://twitter.com/filearts/status/1222502898552180737)):

```
interface WithoutProperties {
  [key: string]: never;
}

// @ts-ignore: Type 'number' is not assignable to type 'never'. (2322)
const a: WithoutProperties = { prop: 1 };
const b: WithoutProperties = {}; // OK
```