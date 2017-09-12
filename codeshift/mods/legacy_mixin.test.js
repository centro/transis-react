jest.autoMockOff();
import legacy_mixin from "./legacy_mixin";
const defineInlineTest = require("jscodeshift/dist/testUtils").defineInlineTest;

// https://astexplorer.net/#/gist/bd57934e0323d31b43cfa2d79663677e/0ae3bcd06f18dfc7a172b7eae4d837ae169009cd
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
      import React from 'react'
      import { StateMixin, PropsMixin } from 'transis-react'
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