import React from 'react'
const MyComp = React.createClass({
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
