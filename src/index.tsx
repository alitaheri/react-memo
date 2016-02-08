/// <reference path="../typings/main.d.ts" />
/// <reference path="../typings.d.ts" />

import * as React from 'react';

export function createSelector(alias, selectors, resolver) {
  return {
    alias,
    selectors,
    resolver,
  };
}

export function createWrapper<P, C>(selectors: __Memo.SelectorDescriptor<P, C>[], options?: __Memo.Options): __Memo.Wrapper {

  return function wrapper<PTarget>(Component: React.ComponentClass<any>): React.ComponentClass<PTarget> {

    class Memo extends React.Component<P, any> {
      public static contextTypes = options && options.contextTypes;
      public static propTypes = options && options.propTypes;

      constructor(props: P, context: C) {
        super(props, context);
        this.state = selectors.reduce((state, selector) => {
          const args = selector.selectors.map(valueSelector => valueSelector(props, context));
          state[selector.alias] = selector.resolver(...args);
          return state;
        }, {});
      }

      shouldComponentUpdate(nextProps: P, nextState: any, nextContext: C): boolean {
        if (options && options.pure === false) {
          return true;
        }
        return selectors.some(
          selector => selector.selectors.some(
            valueSelector => valueSelector(this.props, this.context as C) !== valueSelector(nextProps, nextContext)
          )
        );
      }

      componentWillReceiveProps(nextProps: P, nextContext: C): void {
        let stateModified = false;

        const modifiedState = selectors.reduce((state, selector) => {

          let selectorModified = false;

          const args = selector.selectors.map(valueSelector => {

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
