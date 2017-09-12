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
    return { a: 1 };
  },
  render() {
    return (
      <div>
        my comp{this.state.a}
      </div>
    );
  }
})

export default MyComp
export default MyComp
