import React, { Component } from 'react'
import Transis from 'transis'
window.Transis = Transis

// copied from transis
let nextId = 1;
let updateLog = {};
let updateQueue = {};

function componentCmp(a, b) {
  if (a._transisId < b._transisId) { return -1; }
  else if (a._transisId > b._transisId) { return 1; }
  else { return 0; }
}

function preFlush() {
  updateLog = {};
  Transis.Object.delay(postFlush);
}

function postFlush() {
  let components = [];

  for (let id in updateQueue) {
    components.push(updateQueue[id]);
    delete updateQueue[id];
  }

  // Sort the components by their assigned _transisId. Since components get mounted from the top
  // down, this should ensure that parent components are force updated before any descendent
  // components that also need an update. This avoids the case where we force update a component
  // and then force update one of its ancestors, which may unnecessarily render the component
  // again.
  components.sort(componentCmp).forEach(function(component) {
    if (!updateLog[component._transisId] && component._isMounted) {
      component.forceUpdate();
    }
  });

  Transis.Object.delayPreFlush(preFlush);
}

function queueUpdate(component) {
  updateQueue[component._transisId] = component;
}

function logUpdate(component) {
  updateLog[component._transisId] = true;
}

Transis.Object.delayPreFlush(preFlush);

// end of copied from transis

function transisAware(
  { global, state, props },
  ComposedComponent
) {
  const higherOrderComponent = class HigherOrderComponent extends React.Component {
    constructor(propArgs) {
      super(props)
      // allow both component will mount to get triggered
      this.componentWillMount = () => {
        // setting transis id
        this._transisId = this._transisId || nextId++;
        // setting main update function
        this._transisQueueUpdate = this._transisQueueUpdate || (() => { queueUpdate(this); });

        if (state) {
          // core register sync method
          this._transisSyncState = () => {
            console.warn('transis sync update triggered')
            var stateToUpdate = {};
            for (let k in state) {
              if (this.state[k] !== global[k]) {

                // local state is out of date, off syncing it
                if (this.state[k] && typeof this.state[k].off === 'function') {
                  state[k].forEach(path =>
                    this.state[k].off(path, this._transisQueueUpdate)
                  );
                }

                // global state needs to be attached, on syncing it
                if (global[k] && typeof global[k].on === 'function') {
                  state[k].forEach((path) => { global[k].on(path, this._transisQueueUpdate); });
                }

                stateToUpdate[k] = global[k];
              }
            } // end of for loop
            if (Object.keys(stateToUpdate).length) { this.setState(stateToUpdate); }
          }
          for (let k in state) { // loop through states, on sync all states initially
            if (global[k] && typeof global[k].on === 'function') { // global global
              state[k].forEach((path) => { global[k].on(path, this._transisQueueUpdate); });
            }
          }

          global.on('*', this._transisSyncState)
        }
        // if (props) {
          // propsMixin.componentWillMount.apply(this,arguments);
        // }
      }; //  end of componentWillMount

      this.componentDidMount = () => { this._isMounted = true }


      // this.componentWillUnmount = () => {
      //   if (stateMixin) {
      //     stateMixin.componentWillUnmount.apply(this,arguments);
      //   }
      //   if (propsMixin) {
      //     propsMixin.componentWillUnmount.apply(this,arguments);
      //   }
      // };

      if (state) {
        // initialize State, and props
        this.state = Object.keys(state).reduce((result, key) => {
          result[key] = global[key]
          return result
        }, {})
        console.debug('intialized state to', this.state)
      }
      if (props) {
        // this.componentWillReceiveProps = props.componentWillReceiveProps.bind(this);
      }
    }

    render() {
      return <ComposedComponent {...this.props} {...this.state} />;
    }
  };
  return higherOrderComponent;
}


export default transisAware