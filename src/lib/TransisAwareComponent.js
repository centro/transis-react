// NOTE: does not seem feasible
import React, { Component } from 'react'
class TransisAwareComponent extends Component {


  constructor(props) {
    super(props)
    this.initialStateModifiers = []
    this.state = {}
  }

  stateMixin(globalVar, stateDescriptor) {
    console.info(`calling stateMixin with props: ${stateDescriptor}`)

    // TODO: check if this is better than just using an object iterator like Object.entries.
    const keys = Object.keys(stateDescriptor)

    keys.forEach(key => {
      this.state[key] = stateDescriptor[key]
    })

    // ... modification detectors

  }

  render() {
    return <div>
      <h1>Aware Component</h1>
      { React.cloneElement(
          this.renderCore(),
          { ...this.state }
        )
      }
    </div>
  }
}

export default TransisAwareComponent