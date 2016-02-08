declare namespace __Memo {

  export interface Options {
    pure?: boolean;
    propTypes?: { [name: string]: __React.Validator<any>; };
    contextTypes?: { [name: string]: __React.Validator<any>; };
  }

  export interface Wrapper {
    <P>(Component: __React.ComponentClass<P>): __React.ComponentClass<P>;
  }

  export interface ValueSelector<P, C, TResult> {
    (props: P, context: C): TResult;
  }

  export interface SelectorDescriptor<P, C> {
    alias: string;
    selectors: ValueSelector<P, C, any>[];
    resolver: (...selectorValues: any[]) => any;
  }

  export function createSelector<P, C, V1, V2, V3, V4, V5, V6, V7, V8, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>, ValueSelector<P, C, V5>, ValueSelector<P, C, V6>, ValueSelector<P, C, V7>, ValueSelector<P, C, V8>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8) => TResult): SelectorDescriptor<P, C>;
  export function createSelector<P, C, V1, V2, V3, V4, V5, V6, V7, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>, ValueSelector<P, C, V5>, ValueSelector<P, C, V6>, ValueSelector<P, C, V7>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7) => TResult): SelectorDescriptor<P, C>;
  export function createSelector<P, C, V1, V2, V3, V4, V5, V6, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>, ValueSelector<P, C, V5>, ValueSelector<P, C, V6>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6) => TResult): SelectorDescriptor<P, C>;
  export function createSelector<P, C, V1, V2, V3, V4, V5, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>, ValueSelector<P, C, V5>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5) => TResult): SelectorDescriptor<P, C>;
  export function createSelector<P, C, V1, V2, V3, V4, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4) => TResult): SelectorDescriptor<P, C>;
  export function createSelector<P, C, V1, V2, V3, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>], resolver: (v1: V1, v2: V2, v3: V3) => TResult): SelectorDescriptor<P, C>;
  export function createSelector<P, C, V1, V2, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>], resolver: (v1: V1, v2: V2) => TResult): SelectorDescriptor<P, C>;
  export function createSelector<P, C, V1, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>], resolver: (v1: V1) => TResult): SelectorDescriptor<P, C>;
  export function createSelector<P, C, TResult>(alias: string, selectors: ValueSelector<P, C, any>[], resolver: (...values: any[]) => TResult): SelectorDescriptor<P, C>;

  export function createWrapper<P, C>(selectors: SelectorDescriptor<P, C>[], options?: Options): Wrapper;
}

declare module 'react-memo' {
  export = __Memo;
}
