/// <reference path="../typings/main.d.ts" />

import * as React from 'react';
import * as TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import * as jsdom from 'jsdom';

(global as any).document = jsdom.jsdom('<html><body><div id="root"></div></body></html>');
(global as any).window = (document as any).defaultView;

import {createSelector, createWrapper} from '../src';

class Test extends React.Component<any, any> {
  render() {
    return <div>{this.props.result}</div>;
  }
}

class Context extends React.Component<any, any> {
  static childContextTypes = {
    val1: React.PropTypes.number,
    val2: React.PropTypes.number,
  };

  getChildContext() {
    return { val1: this.props.val1, val2: this.props.val2 };
  }

  render() {
    return this.props.children;
  }
}

describe('selection behavior', () => {
  it('should calculate result correctly from props', () => {

    const selector: any = createSelector('result', [
      (props) => props.val1,
      (props) => props.val2,
    ], (val1, val2) => val1 - val2);

    const wrapper = createWrapper(selector);

    const WrappedTest = wrapper(Test);

    const dom = TestUtils.renderIntoDocument(<WrappedTest val1={3} val2={1}/>);

    const resultElement = TestUtils.findRenderedComponentWithType(dom, Test);
    const result = parseInt(resultElement.props.result);
    expect(result).to.be.equal(2);
  });

  it('should calculate result correctly from context', () => {

    const selector: any = createSelector('result', [
      (props, context) => context.val1,
      (props, context) => context.val2,
    ], (val1, val2) => val1 - val2);

    const wrapper = createWrapper(selector, {contextTypes: {
      val1: React.PropTypes.number,
      val2: React.PropTypes.number,
    }});

    const WrappedTest = wrapper(Test);

    const dom = TestUtils.renderIntoDocument(<Context val1={10} val2={3}><WrappedTest/></Context>);

    const resultElement = TestUtils.findRenderedComponentWithType(dom, Test);
    const result = parseInt(resultElement.props.result);
    expect(result).to.be.equal(7);
  });

  it('should calculate result correctly with mutliple value selectors', () => {

    const selector1: any = createSelector('result1', [
      (props) => props.val1,
      (props) => props.val2,
    ], (val1, val2) => val1 - val2);

    const selector2: any = createSelector('result2', [
      (props) => props.val1,
      (props) => props.val2,
    ], (val1, val2) => val1 / val2);

    const wrapper = createWrapper([selector1, selector2]);

    const WrappedTest = wrapper(Test);

    const dom = TestUtils.renderIntoDocument(<WrappedTest val1={8} val2={2}/>);

    const resultElement = TestUtils.findRenderedComponentWithType(dom, Test);
    const result1 = parseInt(resultElement.props.result1);
    expect(result1).to.be.equal(6);

    const result2 = parseInt(resultElement.props.result2);
    expect(result2).to.be.equal(4);
  });
});

class Mutable extends React.Component<any, any> {
  
  constructor(props) {
    super(props);
    this.state = {val1: props.val1, val2: props.val2};
  }

  setVal1(val1) {
    this.setState({val1});
  }

  setVal2(val2) {
    this.setState({val2});
  }

  render() {
    return React.cloneElement(this.props.children, this.state);
  }
}

describe('memoization behavior', () => {
  it('should recalculate only if selector returns different', () => {

    let calculated = 0;

    const selector: any = createSelector('result', [
      (props) => props.val1,
      (props) => props.val2,
    ], (val1, val2) => { calculated++; });

    const wrapper = createWrapper(selector);

    const WrappedTest = wrapper(Test);

    const dom = TestUtils.renderIntoDocument(<Mutable val1={1} val2={1}><WrappedTest/></Mutable>);
    expect(calculated).to.be.equals(1);

    (dom as any).setVal1(2);
    expect(calculated).to.be.equals(2);

    (dom as any).setVal1(2);
    expect(calculated).to.be.equals(2);

    (dom as any).setVal2(1);
    expect(calculated).to.be.equals(2);

    (dom as any).setVal1(3);
    (dom as any).setVal2(3);
    expect(calculated).to.be.equals(4);
  });
});
