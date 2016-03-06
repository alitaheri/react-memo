# [React Memo](https://github.com/alitaheri/react-memo)
[![npm](https://badge.fury.io/js/react-memo.svg)](https://badge.fury.io/js/react-memo)
[![Build Status](https://travis-ci.org/alitaheri/react-memo.svg?branch=master)](https://travis-ci.org/alitaheri/react-memo)

Heavily inspired by [Reselect](https://github.com/reactjs/reselect).

React Memo is a Higher Order Component wraps the your data derivation logic.

The main objective of this library was(is) to provide memoization logic for
[Material-UI](https://github.com/callemall/material-ui)'s inline-styles. But it can
also be used for any other class of calculations too. 

To use this package you would need to be fairly familiar with
[React](http://facebook.github.io/react/) itself. 

### TL;DR

This is a simply a caching and cache invalidation library that works very well with react.

1. Take data from prop and contex.
2. Run value selectors and get needed values.
3. Run resolver with the values if they are modified from the previous
invocation. (resolver must be very cpu/memory intensive for this to have positive effect)
4. Pass the results down as property.
5. With each call to `componentWillReceiveProps` go to 1.

## Installation

You can install this package with the following command:

```sh
npm install react-memo
```

## Examples

These examples demonstrate how you can use this library:

### Simple Usage

You can pass createWrapper a single property selector.

```js
import React from 'react';
import {createSelector, createWrapper} from 'react-memo';

const TotalViewer = ({total}) => <span>{total}</span>;

// The first argument is the alias.
// The second is the array of value selectors.
// These must be pure and very fast.
// Re-evaluation is decided from changes to the returned
// value from these value selectors via ===.
// The last argument is the function that calculates the value
// of the property passed down. Which is called with the
// values returned from selectors in the same order.
// This is where the heavy calculations go.
const selector: any = createSelector('total', [
  (props) => props.pocket,
  (props) => props.bank,
], (pocket, bank) => /* Intense monetary calcuations */ pocket + bank);

const TotalViewerWrapper = createWrapper(selector)(TotalViewer);

const TotalMoneyIHave = (props) => <TotalViewerWrapper pocket={props.pocket} bank={0} />;

```

### Complex Usage

You can pass createWrapper an array of property selectors and validators as options.

```js
import React from 'react';
import {createSelector, createWrapper} from 'react-memo';

const TotalViewer = ({total, currencySymbol}) =>
  <span>{total}{currencySymbol}</span>;

const totlaSelector: any = createSelector('total', [
  (props) => props.pocket,
  (props) => props.bank,
], (pocket, bank, currency) => pocket + bank);

// Value selectors are also passed context.
// However inorder to use context you must provide the contextTypes.
const currencySymbolSelector: any = createSelector('currencySymbol', [
  (props, context) => context.currency,
], (currency) => currency ? currency : '$');

const contextTypes = { currency: React.PropTypes.string };

const TotalViewerWrapper = createWrapper([
  totlaSelector,
  currencySymbolSelector,
], {contextTypes})(TotalViewer);

const TotalMoneyIHave = (props) => <TotalViewerWrapper pocket={props.pocket} bank={0} />;

```

## API Reference

This section describes the functions in detail.

### createSelector

```js
// Returns a property selector you can pass down to createWrapper
function createSelector(
  alias: string,
  selectors: Array<(props, context) => any>,
  resolver: (...values: any[]) => any
): Selector;

// Provide single selector
function createSelector(
  alias: string,
  selectors: (props, context) => any,
  resolver: (value: any) => any
): Selector;

// Provide no selectors, resolver will be called only once
// during the lifetime of the component.
function createSelector(alias: string, resolver: () => any): Selector;
```

- `alias`: The name of the prop that is to be passed down.
- `selectors`: The value selector or an array of value selectors that are
used to select the arguments for the resolver. These are also used to judge
whether `resolver` should be called.
- `resolver`: The place where the heavy calculations are done.

### createWrapper

```js
createWrapper(selectors: Selector, options?: Options): Wrapper;
createWrapper(selectors: Selector[], options?: Options): Wrapper;

// Options: {propTypes, contextTypes};

// Wrapper: (Component) => WrappedComponent;
```

- `selectors`: A single property selector or an array of them.
- `options`: The object that may contain `propTypes` or `contextTypes` to use in
property validation. Please note that in order to use context in value selectors
you **must** provide the `contextTypes` or React won't pass down the required context.

## Typings

The typescript type definitions are also available and are installed via npm.

## License
This project is licensed under the [MIT license](https://github.com/alitaheri/react-memo/blob/master/LICENSE).
