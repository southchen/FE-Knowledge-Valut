## as const

### Object literals with string-valued properties 

```ts
const Color = {
  red: 'red',
  green: 'green',
  blue: 'blue',
} as const; // (A)
type t = typeof Color
/*
type t = {
    readonly red: "red";
    readonly green: "green";
    readonly blue: "blue";
}
*/
type k = keyof typeof Color 
/*
type k = "red" | "green" | "blue"
*/
// %inferred-type: "red" | "green" | "blue"
type TColor = (typeof Color)[keyof typeof Color];
```

We need [`as const`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) in line A so that `TColor` isn’t `string`. Alas, it doesn’t change anything if the property values are symbols.

Using string-valued properties is:

- Better at development time because we get exhaustiveness checks and a static type for the enum values.
- Worse at runtime because strings can be mistaken for enum values.

```ts
const Color = {
  red: 'red',
  green: 'green',
  blue: 'blue',
} 
type t = typeof Color
/*
type t = {
    red: string;
    green: string;
    blue: string;
}
*/
type k = keyof typeof Color 
/*
type k = "red" | "green" | "blue"
*/
type TColor = (typeof Color)[keyof typeof Color];
//type TColor = string
```

