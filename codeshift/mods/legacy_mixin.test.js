jest.autoMockOff();
import legacy_mixin from "./legacy_mixin";
const defineInlineTest = require("jscodeshift/dist/testUtils").defineInlineTest;

// https://astexplorer.net/#/gist/bd57934e0323d31b43cfa2d79663677e/b0c7b48da1712a7eae776e073069bb05b2bb6a43
describe("legacy_mixin", () => {
  describe("works", () => {
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

      import { StateMixin, PropsMixin } from 'transis-react';
    `);
  });
})