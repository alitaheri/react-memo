import * as React from 'react';

export interface Options {
  propTypes?: { [name: string]: __React.Validator<any>; };
  contextTypes?: { [name: string]: __React.Validator<any>; };
}

export interface Wrapper {
  <P>(Component: __React.ComponentClass<P>): __React.ComponentClass<P>;
}

export interface ValueSelector<P, C, TResult> {
  (props: P, context: C): TResult;
}

export interface Selector<P, C> {
  alias: string;
  valueSelectors: ValueSelector<P, C, any>[];
  resolver: (...selectorValues: any[]) => any;
}

export function createSelector<P, C, V1, V2, V3, V4, V5, V6, V7, V8, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>, ValueSelector<P, C, V5>, ValueSelector<P, C, V6>, ValueSelector<P, C, V7>, ValueSelector<P, C, V8>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7, v8: V8) => TResult): Selector<P, C>;
export function createSelector<P, C, V1, V2, V3, V4, V5, V6, V7, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>, ValueSelector<P, C, V5>, ValueSelector<P, C, V6>, ValueSelector<P, C, V7>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6, v7: V7) => TResult): Selector<P, C>;
export function createSelector<P, C, V1, V2, V3, V4, V5, V6, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>, ValueSelector<P, C, V5>, ValueSelector<P, C, V6>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5, v6: V6) => TResult): Selector<P, C>;
export function createSelector<P, C, V1, V2, V3, V4, V5, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>, ValueSelector<P, C, V5>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4, v5: V5) => TResult): Selector<P, C>;
export function createSelector<P, C, V1, V2, V3, V4, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>, ValueSelector<P, C, V4>], resolver: (v1: V1, v2: V2, v3: V3, v4: V4) => TResult): Selector<P, C>;
export function createSelector<P, C, V1, V2, V3, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>, ValueSelector<P, C, V3>], resolver: (v1: V1, v2: V2, v3: V3) => TResult): Selector<P, C>;
export function createSelector<P, C, V1, V2, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>, ValueSelector<P, C, V2>], resolver: (v1: V1, v2: V2) => TResult): Selector<P, C>;
export function createSelector<P, C, V1, TResult>(alias: string, selectors: [ValueSelector<P, C, V1>], resolver: (v1: V1) => TResult): Selector<P, C>;
export function createSelector<P, C, TResult>(alias: string, selectors: ValueSelector<P, C, any>[], resolver: (...values: any[]) => TResult): Selector<P, C>;
export function createSelector<P, C, TResult>(alias: string, selectors: ValueSelector<P, C, any>, resolver: (value: any) => TResult): Selector<P, C>;
export function createSelector<P, C, TResult>(alias: string, resolver: () => TResult): Selector<P, C>;
export function createSelector(alias, ...rest): Selector<any, any> {
  if (rest.length === 1) {
    return {
      alias,
      valueSelectors: [],
      resolver: rest[0],
    };
  }

  return {
    alias,
    valueSelectors: Array.isArray(rest[0]) ? rest[0] : [rest[0]],
    resolver: rest[1],
  };
}

export function createWrapper<P, C>(selectors: Selector<P, C>, options?: Options): Wrapper;
export function createWrapper<P, C>(selectors: Selector<P, C>[], options?: Options): Wrapper;
export function createWrapper<P, C>(selectors: Selector<P, C>[] | Selector<P, C>, options?: Options): Wrapper {

  if (!Array.isArray(selectors)) {
    selectors = [selectors as any];
  }

  return function wrapper<PTarget>(Component: React.ComponentClass<any>): React.ComponentClass<PTarget> {

    class Memo extends React.Component<P, any> {
      public static contextTypes = options && options.contextTypes;
      public static propTypes = options && options.propTypes;

      constructor(props: P, context: C) {
        super(props, context);
        this.state = (selectors as Selector<P, C>[]).reduce((state, selector) => {
          const args = selector.valueSelectors.map(valueSelector => valueSelector(props, context));
          state[selector.alias] = selector.resolver(...args);
          return state;
        }, {});
      }

      componentWillReceiveProps(nextProps: P, nextContext: C): void {
        let stateModified = false;

        const modifiedState = (selectors as Selector<P, C>[]).reduce((state, selector) => {

          let selectorModified = false;

          const args = selector.valueSelectors.map(valueSelector => {

            const oldValue = valueSelector(this.props, this.context as C);
            const newValue = valueSelector(nextProps, nextContext);

            if (oldValue !== newValue) {
              stateModified = true;
              selectorModified = true;
            }

            return newValue;
          });

          if (selectorModified) {
            state[selector.alias] = selector.resolver(...args);
          }

          return state;
        }, {});

        if (stateModified) {
          this.setState(modifiedState);
        }
      }

      render() {
        return <Component {...this.props} {...this.state} />;
      }
    }

    return Memo as any;
  }
}
