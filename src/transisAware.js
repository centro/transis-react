import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Transis from 'transis'

// Note: not exactly sure when this is needed: work around for this multiple instance issue
// let mundo; try { mundo = window } catch (e) { mundo = global }
// const Transis = mundo.Transis || MyTransis

// copied from transis
import {
  assignTransisIdTo,
  updateLog,
  updateQueue,
  logUpdate,
  queueUpdate,
} from './helper'


// * Refactor Effort *
// @param {TransisObject} globalTransisObjectVar - transis object attached to some globalTransisObject namespace
// @param {Array} attrsToWatch - props on the globalTransisObjectVar that the component should watch for
const bindState = (globalTransisObjectVar, attrsToWatch, callback) => {
  if (globalTransisObjectVar && typeof globalTransisObjectVar.on === 'function') {
    attrsToWatch.forEach(attrPath =>
      globalTransisObjectVar.on(attrPath, callback)
    )
  }
}

const unbindState = (stateVar, attrsToWatch, callback) => {
  if (stateVar && typeof stateVar.off === 'function') {
    attrsToWatch.forEach(attrPath =>
      stateVar.off(attrPath, callback)
    )
  }
}

const unbindProps = (propsVar, attrsToWatch, callback) => {
  attrsToWatch.forEach(attrPath =>
    propsVar && propsVar.off(attrPath, callback)
  )
}

const bindProps = (propsVar, attrsToWatch, callback) => {
  attrsToWatch.forEach(attrPath =>
    propsVar && propsVar.on(attrPath, callback)
  )
}

// component will mount
const componentWillMount = function({ globalTransisObject, state, props }) {
  if (state || props) {
      // setting transis id
    assignTransisIdTo(this)

    // setting main update function
    const wrapQueueUpdate = () => { queueUpdate(this) } // name this function
    this._transisQueueUpdate = this._transisQueueUpdate || wrapQueueUpdate;
  }
  if (state) {
    // core register sync method
    this._transisSyncState = () => {
      // console.warn('transis sync update triggered')

      var stateToUpdate = {};
      for (let k in state) {
        if (this.state[k] !== globalTransisObject[k]) {
          // local state is out of date, off syncing it
          unbindState(this.state[k], state[k], this._transisQueueUpdate)

          // globalTransisObject state needs to be attached, on syncing it
          bindState(globalTransisObject[k], state[k], this._transisQueueUpdate)

          stateToUpdate[k] = globalTransisObject[k];
        }
      } // end of for loop

      if (Object.keys(stateToUpdate).length) {
        this.setState(stateToUpdate);
      }
    }

    for (let k in state) { // loop through states, on sync all states initially
      bindState(globalTransisObject[k], state[k], this._transisQueueUpdate)
    }

    globalTransisObject.on('*', this._transisSyncState)
  }

  if (props) {
    for (let k in props) {
      bindProps(this.props[k], props[k], this._transisQueueUpdate)
    }
  }
} // end of Component Will Mount Factory
// * end Refactor Effort *

// main constructor
const transisAware = (
  { global: globalTransisObject, state, props },
  ComposedComponent,
) => {
  if (!globalTransisObject && state) {
    throw new Error("Cannot compose with-state component without global transis object, state: ", state)
  }

  // convert prop into into an object of empty arrays
  // e.g. StateMixin({}, 'a', 'b', 'c') -> props {}= { a: [], b: [], c: [] }
  if (({}).toString.call(state).includes('Array')) { // is an array
    state = state.reduce((obj, stateName) => {
      obj[stateName] = []
      return obj
    }, {})
  }

  const higherOrderComponent = class HigherOrderComponent extends React.Component {
    // allow both component will mount to get triggered
    // debugMode = false
    constructor(propArgs) {
      super(propArgs)
      // if (propArgs.debug) { this.debugMode = true }

      if (state) {
        // initialize State
        this.state = Object.keys(state).reduce((result, key) => {
          result[key] = globalTransisObject[key]
          return result
        }, {})
      }
      if (props) {
        this.componentWillReceiveProps = (nextProps) => {
          // console.warn('component will receive props', nextProps)
          for (let k in props) {
            props[k].forEach(prop => {
              if (nextProps[k] !== this.props[k]) {
                if (this.props[k]) {
                  this.props[k].off(prop, this._transisQueueUpdate);
                }
                if (nextProps[k]) {
                  nextProps[k].on(prop, this._transisQueueUpdate);
                }
              }
            });
          }
        }
      }
    }

    componentWillMount = () => {
      // this.debugMode && console.warn('component will mount', this._transisId)
      return componentWillMount.call(this, {
        globalTransisObject, state, props
      })
    }

    componentDidMount = () => {
      // this.debugMode && console.warn('component did mounted', this._transisId)
      this.haveMounted = true
      logUpdate(this)
    }
    componentDidUpdate = () => {
      // this.debugMode && console.warn('component did update', this._transisId)
      logUpdate(this)
    }

    componentWillUnmount = () => {
      // this.debugMode && console.warn('component will unmount', this._transisId)
      this.haveUnmounted = true
      if (state) {
        for (let k in state) {
          unbindState(this.state[k], state[k], this._transisQueueUpdate)
        }
        globalTransisObject.off('*', this._transisSyncState);
      }
      if (props) {
        for (let k in props) {
          unbindProps(this.props[k], props[k], this._transisQueueUpdate)
        }
      }
    };

    render = () => 
      <ComposedComponent 
        ref={core => this.core = core} 
        {...this.props} 
        {...this.state} 
      />
  };
  return higherOrderComponent;
}

transisAware.Transis = Transis // for verifying Transis instances

transisAware.updateLog = updateLog // for debugging purposes
transisAware.updateQueue = updateQueue


export default transisAware
