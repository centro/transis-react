import React, { Component } from 'react'
import Transis from 'transis'

// Note: not exactly sure when this is needed: work around for this multiple instance issue
// let mundo; try { mundo = window } catch (e) { mundo = global }
// const Transis = mundo.Transis || MyTransis

// copied from transis
import {
  assignTransisIdTo,

  queueUpdate,
  unqueueUpdate,
  updateQueue,

  logUpdate,
  updateLog,
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

// TODO: better way of writing this
const remapStateToProps = ({ props, state, remap }) => {
  let newState = {}
  if (remap) {
    for (let [k, v] of Object.entries(state)) {
      newState[remap[k]] = v
    }
  }
  else {
    newState = state
  }
  
  if (props && newState) {
    const statePropsConflicts = findDuplicate([...Object.keys(newState), ...Object.keys(props)])
    if (statePropsConflicts.length) {
      throw new Error(`state variable names conflicted with props, please remap the following: "${statePropsConflicts.join(', ')}"`)
    }
  }
  
  return newState
}

const ObjectValues = obj =>
  Object.entries(obj).reduce((acc, next) => [...acc, next[1]], [])

const findDuplicate = list => {
  const set = list.reduce((set, item) => { 
    set[item] = set[item] || 0
    set[item]++
    return set
  }, {})
  return Object.entries(set).filter(v => v[1] > 1).map(v => v[0])
}
// * end Refactor Effort *

// main constructor
const transisReact = (
  { global: globalTransisObject, state, props, remap },
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

  if (state && remap) {
    const futurePropKeys = ObjectValues(remap)
    const propKeys = Object.keys(state)
    const intersect = futurePropKeys.filter(propKey => propKeys.includes(propKey))

    if (intersect.length) {
      throw new Error(`Cannot remap conflicting names "${intersect.join(', ')}"`)
    }
    remap = {
      ...propKeys.reduce((map, next) => {
        map[next] = next
        return map
      }, {}),
      ...remap
    }
  }

  const higherOrderComponent = class HigherOrderComponent extends React.Component {
    // allow both component will mount to get triggered
    constructor(propArgs) {
      super(propArgs)
      if (state) {
        // initialize State
        this.state = Object.keys(state).reduce((result, key) => {
          result[key] = globalTransisObject[key]
          return result
        }, {})
      }
      if (props) {
        this.componentWillReceiveProps = (nextProps) => {
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
            })
          }
        }
      }
    }

    componentWillMount = () => {
      return componentWillMount.call(this, {
        globalTransisObject, state, props
      })
    }

    componentDidMount = () => {
      logUpdate(this)
    }
    componentDidUpdate = () => {
      logUpdate(this)
    }

    componentWillUnmount = () => {
      unqueueUpdate(this)
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

    render = () => {
      const stateParams = remapStateToProps({ props: this.props, state: this.state, remap })

      return <ComposedComponent
        ref={core => this.core = core}
        {...this.props}
        {...stateParams}
      />
    }
  };
  return higherOrderComponent;
}

transisReact.Transis = Transis // for verifying Transis instances

transisReact.updateLog = updateLog // for debugging purposes
transisReact.updateQueue = updateQueue


export default transisReact
