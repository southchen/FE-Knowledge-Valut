# Assignbility & Compatibility

Type compatibility in TypeScript is based on structural subtyping. Structural typing is a way of relating types based solely on their members.

## Subtype vs Assignment

So far, we’ve used “compatible”, which is not a term defined in the language spec. In TypeScript, there are two kinds of compatibility: subtype and assignment. These differ only in that assignment extends subtype compatibility with rules to allow assignment to and from `any`, and to and from `enum` with corresponding numeric values.

Different places in the language use one of the two compatibility mechanisms, depending on the situation. For practical purposes, type compatibility is dictated by assignment compatibility, even in the cases of the `implements` and `extends` clauses.



Union types have the following subtype relationships:

- A union type *U* is a subtype of a type *T* if each type in *U* is a subtype of *T*.
- A type *T* is a subtype of a union type *U* if *T* is a subtype of any type in *U*.

Similarly, union types have the following assignability relationships:

- A union type *U* is assignable to a type *T* if each type in *U* is assignable to *T*.
- A type *T* is assignable to a union type *U* if *T* is assignable to any type in *U*.

Intersection types have the following subtype relationships:

- An intersection type *I* is a subtype of a type *T* if any type in *I* is a subtype of *T*.
- A type *T* is a subtype of an intersection type *I* if *T* is a subtype of each type in *I*.

Similarly, intersection types have the following assignability relationships:

- An intersection type *I* is assignable to a type *T* if any type in *I* is assignable to *T*.
- A type *T* is assignable to an intersection type *I* if *T* is assignable to each type in *I*.

#### *assignable to*

TypeScript considers a type *assignable to* another type if one is an acceptable substitute for the other. In other words, a `Cat` is *assignable to* an `Animal` because a `Cat` is an acceptable substitute for an `Animal`.

