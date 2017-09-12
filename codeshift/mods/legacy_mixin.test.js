jest.autoMockOff();
const legacy_mixin = require("./legacy_mixin");
const defineInlineTest = require("jscodeshift/dist/testUtils").defineInlineTest;

// https://astexplorer.net/#/gist/bd57934e0323d31b43cfa2d79663677e/b0c7b48da1712a7eae776e073069bb05b2bb6a43
fdescribe("legacy_mixin", () => {

  fdescribe('neither', () => {
    defineInlineTest(legacy_mixin, {}, `
      const MyComp = React.createClass({
        mixins: [
          OtherMixin
        ],
        render() { }
      })
    `, `
    `);
  })

  describe("only state mixin", () => {
    defineInlineTest(legacy_mixin, {}, `
      const MyComp = React.createClass({
        mixins: [
          Transis.ReactStateMixin(global.appState, {
            foo: ['bar', 'baz']
          }),
        ],
        render() { }
      })
    `, `
      import { StateMixin } from 'transis-react';
      const MyComp = React.createClass({
        mixins: [
          StateMixin(global.appState, {
            foo: ['bar', 'baz']
          }),
        ],
        render() { }
      })
    `);
  })

  describe("only props mixin", () => {
    defineInlineTest(legacy_mixin, {}, `
      const MyComp = React.createClass({
        mixins: [
          Transis.ReactPropsMixin({
            foo: ['bar', 'baz']
          }),
        ],
        render() { }
      })
    `, `
      import { PropsMixin } from 'transis-react';
      const MyComp = React.createClass({
        mixins: [
          PropsMixin({
            foo: ['bar', 'baz']
          }),
        ],
        render() { }
      })
    `);
  })

  describe("both", () => {
    defineInlineTest(legacy_mixin, {}, `
      import React from 'react'
      const MyComp = React.createClass({
        mixins: [
          Transis.ReactStateMixin(global.appState, {
            foo: ['bar', 'baz']
          }),
          Transis.ReactPropsMixin({
            qux: ['quux']
          })
        ],
        getInitialState() {
          return { a: 1 }
        },
        render() {
          return <div>my comp{this.state.a}</div>
        }
      })
    `, `
      import { StateMixin, PropsMixin } from 'transis-react';
      import React from 'react'
      const MyComp = React.createClass({
        mixins: [
          StateMixin(global.appState, {
            foo: ['bar', 'baz']
          }),
          PropsMixin({
            qux: ['quux']
          })
        ],
        getInitialState() {
          return { a: 1 }
        },
        render() {
          return <div>my comp{this.state.a}</div>
        }
      })
    `);
  });
})