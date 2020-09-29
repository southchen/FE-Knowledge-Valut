[toc]

# enum

Each enum member has a *name* and a *value*. The default for enums is to be *numeric*.

The TypeScript manual uses camel-cased names that start with uppercase letters. This is the standard TypeScript style and we used it for the `NoYes` enum.

### Quoting enum member names

```ts
enum HttpRequestField {
  'Accept',
  'Accept-Charset',
  'Accept-Datetime',
  'Accept-Encoding',
  'Accept-Language',
}
assert.equal(HttpRequestField['Accept-Charset'], 1);
```

There is no way to compute the names of enum members. Object literals support computed names via square brackets.

## Specifying enum member values 

TypeScript distinguishes three ways of specifying enum member values:

- *Literal enum members* are initialized:
  - implicitly or
  - via number literals or string literals (explicitly). So far, we have only used literal members.
- *Constant enum members* are initialized via expressions whose results can be computed at compile time.
- *Computed enum members* are initialized via arbitrary expressions.

### Literal enum members 

If an enum has only literal members, we can use those members as types (similar to how, e.g., number literals can be used as types):

```ts
enum NoYes {
  No = 'No',
  Yes = 'Yes',
}
function func(x: NoYes.No) {
  return x;
}

func(NoYes.No); // OK

//@ts-ignore: Argument of type '"No"' is not assignable to
//            parameter of type 'NoYes.No'.
func('No');

//@ts-ignore: Argument of type 'NoYes.Yes' is not assignable to
//            parameter of type 'NoYes.No'.
func(NoYes.Yes);
```

### Computed enum members

### Downside of numeric enums: loose type-checking 

```ts
enum NoYes { No, Yes }
function func(noYes: NoYes) {}
func(33); // no error!
```

### Recommendation: prefer string-based enums

```ts
num NoYes { No='No', Yes='Yes' }
function func(noYes: NoYes) {}
console.log(NoYes.No);
console.log(NoYes.Yes);
// Output:
// 'No'
// 'Yes'
//@ts-ignore: Argument of type '"abc"' is not assignable
//            to parameter of type 'NoYes'.
func('abc');
//@ts-ignore: Argument of type '"Yes"' is not assignable
//            to parameter of type 'NoYes'.
func('Yes');
```

### more self-descriptive than booleans

```ts
class List1 {
  isOrdered: boolean;
  // ···
}
```

However, an enum is more self-descriptive and has the additional benefit that we can add more alternatives later if we need to.

```ts
enum ListKind { ordered, unordered }
class List2 {
  listKind: ListKind;
  // ···
}
```

TypeScript treats (non-const) enums as if they were objects:

```ts
enum NoYes {
  No = 'No',
  Yes = 'Yes',
}
function func(obj: { No: string }) {
  return obj.No;
}
assert.equal(
  func(NoYes), // allowed statically!
  'No');
```

### `keyof` and enums

```
enum HttpRequestKeyEnum{
  Accpet='Accept',
  AcceptCharset='Accept-Charset',
}

type unu  = keyof HttpRequestKeyEnum //type unu = number | "toString" | "charAt" | "charCodeAt" | "concat" | "indexOf" | "lastIndexOf" | "localeCompare" | "match" | "replace" | "search" | "slice" | "split" | "substring" | "toLowerCase" | ... 27 more ... | "padEnd"
type unu1 =keyof typeof HttpRequestKeyEnum //type unu1 = "Accpet" | "AcceptCharset"
type unu2= typeof HttpRequestKeyEnum //type unu2 = typeof HttpRequestKeyEnum


```



