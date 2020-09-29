```js

/**
 * A hook to access the redux `dispatch` function.
 *
 * Note for `redux-thunk` users: the return type of the returned `dispatch` functions for thunks is incorrect.
 * However, it is possible to get a correctly typed `dispatch` function by creating your own custom hook typed
 * from the store's dispatch function like this: `const useThunkDispatch = () => useDispatch<typeof store.dispatch>();`
 *
 * @returns redux store's `dispatch` function
 *
 * @example
 *
 * import React from 'react'
 * import { useDispatch } from 'react-redux'
 *
 * export const CounterComponent = ({ value }) => {
 *   const dispatch = useDispatch()
 *   return (
 *     <div>
 *       <span>{value}</span>
 *       <button onClick={() => dispatch({ type: 'increase-counter' })}>
 *         Increase counter
 *       </button>
 *     </div>
 *   )
 * }
 */
// NOTE: the first overload below and note above can be removed if redux-thunk typings add an overload for
// the Dispatch function (see also this PR: https://github.com/reduxjs/redux-thunk/pull/247)
export function useDispatch<TDispatch = Dispatch<any>>(): TDispatch;
export function useDispatch<A extends Action = AnyAction>(): Dispatch<A>;

/**
 * A hook to access the redux store's state. This hook takes a selector function
 * as an argument. The selector is called with the store state.
 *
 * This hook takes an optional equality comparison function as the second parameter
 * that allows you to customize the way the selected state is compared to determine
 * whether the component needs to be re-rendered.
 *
 * If you do not want to have to specify the root state type for whenever you use
 * this hook with an inline selector you can use the `TypedUseSelectorHook` interface
 * to create a version of this hook that is properly typed for your root state.
 *
 * @param selector the selector function
 * @param equalityFn the function that will be used to determine equality
 *
 * @returns the selected state
 *
 * @example
 *
 * import React from 'react'
 * import { useSelector } from 'react-redux'
 * import { RootState } from './store'
 *
 * export const CounterComponent = () => {
 *   const counter = useSelector((state: RootState) => state.counter)
 *   return <div>{counter}</div>
 * }
 */
export function useSelector<TState = DefaultRootState, TSelected = unknown>(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected;

/**
 * This interface allows you to easily create a hook that is properly typed for your
 * store's root state.
 *
 * @example
 *
 * interface RootState {
 *   property: string;
 * }
 *
 * const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
 *
 */
export interface TypedUseSelectorHook<TState> {
    <TSelected>(
        selector: (state: TState) => TSelected,
        equalityFn?: (left: TSelected, right: TSelected) => boolean
    ): TSelected;
}

```

