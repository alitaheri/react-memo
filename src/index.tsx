/// <reference path="../typings/main.d.ts" />
/// <reference path="../typings.d.ts" />

import * as React from 'react';

export function createSelector(alias, ...rest): __Memo.Selector<any, any> {
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

export function createWrapper<P, C>(selectors: __Memo.Selector<P, C>[], options?: __Memo.Options): __Memo.Wrapper {

  if (!Array.isArray(selectors)) {
    selectors = [selectors as any];
  }

  return function wrapper<PTarget>(Component: React.ComponentClass<any>): React.ComponentClass<PTarget> {

    class Memo extends React.Component<P, any> {
      public static contextTypes = options && options.contextTypes;
      public static propTypes = options && options.propTypes;

      constructor(props: P, context: C) {
        super(props, context);
        this.state = selectors.reduce((state, selector) => {
          const args = selector.valueSelectors.map(valueSelector => valueSelector(props, context));
          state[selector.alias] = selector.resolver(...args);
          return state;
        }, {});
      }

      componentWillReceiveProps(nextProps: P, nextContext: C): void {
        let stateModified = false;

        const modifiedState = selectors.reduce((state, selector) => {

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
