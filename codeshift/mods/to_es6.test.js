jest.autoMockOff();
// import to_es6 from "./to_es6";
// import mixinDataExtract from "../submods/mixinDataExtract";
// import replaceStateWithProps from "../submods/replaceStateWithProps";
const to_es6 = require("./to_es6");
const mixinDataExtract = require("../submods/mixinDataExtract");
const replaceStateWithProps = require("../submods/replaceStateWithProps");

const defineInlineTest = require("jscodeshift/dist/testUtils").defineInlineTest;

const xdefineInlineTest = () => {}

// NOTE: problematic
// const defineTest = require("jscodeshift/dist/testUtils").defineTest;

describe("to_es6", () => {
  // Part 1
  describe("Step 1: mixinDataExtract Transformer", () => {
    defineInlineTest(mixinDataExtract, {}, `
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
      var stateMixin = {
        global: global.appState,

        state: {
          foo: ['bar', 'baz']
        }
      };

      var propsMixin = {
        props: {
          qux: ['quux']
        }
      };

      import React from 'react'
      const MyComp = React.createClass({
        getInitialState() {
          return { a: 1 }
        },

        render() {
          return <div>my comp{this.state.a}</div>
        }
      })
    `);
  })

  describe('Step4: replaceStateWithProps', () => {
    defineInlineTest(replaceStateWithProps, {}, `
       var stateMixin = {
          global: globalState,
          state: {
            foo: ["abc"],
            bar: ['efg2']
          }
        }
        var propsMixin = {
          props: {
            qux: ["quux"]
          }
        }
        import React from "react";
        transisReact(
          {
            global: global.appState,
            state: { foo: ["abc"], bar: ['efg2'] },
            props: { qux: ["quux"] }
          },
          class MyComp extends React.Component {
            render2() {
              return <div>{ this.state.ignored } {this.state.bar} </div>
            }

            render() {
              const { foo } = this.state

              return (
                <div>
                  { this.state.ignored }
                  { this.state.bar }
                </div>
              );
            }
          }
        );
      `, `
        var stateMixin = {
          global: globalState,
          state: {
            foo: ["abc"],
            bar: ['efg2']
          }
        }
        var propsMixin = {
          props: {
            qux: ["quux"]
          }
        }
        import React from "react";
        transisReact(
          {
            global: global.appState,
            state: { foo: ["abc"], bar: ['efg2'] },
            props: { qux: ["quux"] }
          },
          class MyComp extends React.Component {
            render2() {
              return <div>{ this.state.ignored } {this.props.bar} </div>;
            }

            render() {
              const { foo } = this.props

              return (
                <div>
                  { this.state.ignored }
                  { this.props.bar }
                </div>
              );
            }
          }
        );
      `);
  })

  // The complete transformer
  describe('skips if no mixin found', () => {
    defineInlineTest(to_es6, {},
      `
        import React from 'react';
        const MyComp = React.createClass({
          getInitialState() {
            return { a: 1 }
          },
          render() {
            return <div>my comp{this.state.a}</div>
          }
        })
      `,
      ``
      // `
      //   import React from 'react';

      //   class MyComp extends React.Component {
      //     state = { a: 1 };

      //     render() {
      //       return <div>my comp{this.state.a}</div>
      //     }
      //   }
      // `
    )
  })


  // test that component that are class wont change
  describe('skips existing es6', () => {
    defineInlineTest(to_es6, {}, `
      import React from 'react';

      class MyComp extends React.Component {
        constructor() {
          super()
          this.state = { a: 1 }
        }
        render() {
          return <div>my comp{this.state.a}</div>
        }
      }
    `, `
    `)
  })


  // change mixins
  xdescribe('with transis react mixins', () => {
    defineInlineTest(to_es6, {}, `
      import React from 'react'
      const MyComp = React.createClass({
        mixins: [
          Transis.ReactStateMixin(global.appState, {
            foo: ['bar', 'baz']
          }),
          Transis.ReactPropsmixin({
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
    `,
    // TODO: make this render {this.state.foo.vars} as {this.props.foo.vars}
    `
      import React from 'react'
      import transisReact from 'transis-react'

      transisReact({
        global: global.appState,
        state: {
          foo: ['bar', 'baz']
        },
        props: {
          qux: ['quux']
        }
      }, class MyComp extends React.Component {
        state = { a: 1 };

        render() {
          return <div>my comp{this.state.a}</div>
        }
      })
    `);
  })
});
