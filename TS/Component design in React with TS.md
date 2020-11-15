# Component design in React with TS

*one union* of *multiple interfaces*:

```tsx
interface CommonSelectProps {
  placeholder?: string;
  options: string[];
}

interface SingleSelectProps extends CommonSelectProps {
  multiple?: false;
  value: string;
  onChange: (newValue: string) => void;
}

interface MultipleSelectProps extends CommonSelectProps {
  multiple: true;
  value: string[];
  onChange: (newValue: string[]) => void;
}

type SelectProps = SingleSelectProps | MultipleSelectProps;

class Select extends React.Component<SelectProps> {
  // ...
}
```

 the union type `SelectProps` can be discriminated by its `multiple` property. And as luck would have it, TypeScript will do exactly that when you pass (or don’t pass) the `multiple` prop to your new and improved component:

```tsx
// Compiler knows that `value` shouldn’t be an array
<Select
  options={['Red', 'Green', 'Blue']}
  value={['Red', 'Blue']}
  onChange={onChange}
/>

// Compiler knows that `value` should be an array
<Select
  multiple
  options={['Red', 'Green', 'Blue']}
  value="Red"
  onChange={onChange}
/>

// Compiler knows that `newValue` will be a string
<Select
  multiple={false}
  options={['Red', 'Green', 'Blue']}
  value="Red"
  onChange={newValue => {
    console.log(newValue.toLowerCase())
  }}
/>
```



```ts
interface CommonSelectProps {
  placeholder?: string;
}
﻿
interface SingleSelectPropsFragment {
  multiple: false;
  value: string;
  onChange: (newValue: string[]) => void;
}
﻿
interface MultipleSelectPropsFragment {
  multiple: true;
  value: string[];
  onChange: (newValue: string[]) => void;
}
﻿
interface UngroupedSelectPropsFragment {
  grouped?: false;
  options: string[];
}

type OptionGroup = {
  title: string;
  options: string[];
};

interface GroupedSelectPropsFragment {
  grouped: true;
  options: OptionGroup[];
  renderGroup: (group: OptionGroup) => React.ReactNode;
}

// All together now...
type SelectProps = CommonSelectProps &
  (SingleSelectPropsFragment | MultipleSelectPropsFragment) &
  (UngroupedSelectPropsFragment | GroupedSelectPropsFragment);

class Select extends React.Component<SelectProps> {
  // ...
}
```

#### Limitations of structural typing

Unfortunately, for good or for bad, Typescript is a structural type system, and this allows us to bypass some of the safety if we are not careful. The `NoFields`type (empty object, `{}`), in Typescript, means something totally different to what we want it to do. Actually when we write:

```typescript
interface Foo {
  field: string;
};
```

Typescript understands that any `object`with a `field`of type `string`is good, except for the case where we create a new object, like:

```typescript
const myFoo : Foo = { field: "asdf" };  // In this case we can't add more fields
```

But, on assignment, Typescript tests using structural typing, and that means our objects may end with more fields that what we would like them to have:

```typescript
const getReady = { field: "asdf", unexpectedField: "hehehe" };
const myFoo : Foo = getReady;  // This is not an error
```

So, when we extend this idea to the empty object `{}`, turns out that on assignment, Typescript will accept any value as long as that value is an object, and has all the fields demanded. Because the type demands no fields, this second condition succeeds trivially for any `object`, which is totally not what we wanted it to do.

```typescript
type O extends {}
```



<a href='https://blog.andrewbran.ch/expressive-react-component-apis-with-discriminated-unions/'>ref link</a>
