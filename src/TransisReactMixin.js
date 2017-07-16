//  support
import {
  assignTransisIdTo,
  updateLog,
  updateQueue,
  logUpdate,
  queueUpdate,
} from './helper'

// Legacy Prop Mixin
export const PropsMixin = function(props) {
  return {
    componentWillMount: function() {
      assignTransisIdTo(this)
      this._transisQueueUpdate = this._transisQueueUpdate || (() => { queueUpdate(this); });

      for (let k in props) {
        props[k].forEach(function(prop) {
          if (this.props[k]) { this.props[k].on(prop, this._transisQueueUpdate); }
        }, this);
      }
    },

    componentDidMount: function() {
      logUpdate(this);
    },

    componentDidUpdate: function() {
      logUpdate(this);
    },

    componentWillUnmount: function() {
      for (let k in props) {
        props[k].forEach(function(prop) {
          if (this.props[k]) { this.props[k].off(prop, this._transisQueueUpdate); }
        }, this);
      }
    },

    componentWillReceiveProps: function(nextProps) {
      for (let k in props) {
        props[k].forEach(function(prop) {
          if (nextProps[k] !== this.props[k]) {
            if (this.props[k]) { this.props[k].off(prop, this._transisQueueUpdate);  }
            if (nextProps[k]) { nextProps[k].on(prop, this._transisQueueUpdate); }
          }
        }, this);
      }
    }
  };
};

//  State Mixin
export const StateMixin = function(...args) {
  let [object, props] = args
  if (typeof props !== 'object') {
    // convert prop into into an object of empty arrays
    // e.g.
    // StateMixin({}, 'a', 'b', 'c') -> props become { a: [], b: [], c: [] }
    props = [].slice.call(args, 1).reduce(function(acc, prop) {
      acc[prop] = [];
      return acc;
    }, {});
  }

  return {
    getInitialState: function() {
      var state = {};
      for (let k in props) { state[k] = object[k]; }
      return state;
    },

    componentWillMount: function() {
      assignTransisIdTo(this)
      this._transisQueueUpdate = this._transisQueueUpdate || (() => { queueUpdate(this); });

      this._transisSyncState = () => {
        var state = {};

        // for appstate variables, loop
        for (let k in props) {
          if (this.state[k] !== object[k]) { // if the var is changed
            // if local state var exist and it can `off`?!, turn off the update watcher
            if (this.state[k] && typeof this.state[k].off === 'function') {
              props[k].forEach((path) => { this.state[k].off(path, this._transisQueueUpdate); });
            }

            // if global state var exist and it can `on`?!, turn on update watcher
            if (object[k] && typeof object[k].on === 'function') {
              props[k].forEach((path) => { object[k].on(path, this._transisQueueUpdate); });
            }

            state[k] = object[k]; // prepare to attach global var to local var
          }
        }

        if (Object.keys(state).length) { this.setState(state); } // update if there is a need
      };

      for (let k in props) { // loop through states, on sync all states initially
        if (object[k] && typeof object[k].on === 'function') { // global object
          props[k].forEach((path) => { object[k].on(path, this._transisQueueUpdate); });
        }
      }

      object.on('*', this._transisSyncState);
    },

    componentDidMount: function() {
      logUpdate(this);
    },

    componentDidUpdate: function() {
      logUpdate(this);
    },

    componentWillUnmount: function() {
      for (let k in props) {
        if (this.state[k] && typeof this.state[k].off === 'function') {
          props[k].forEach((path) => { this.state[k].off(path, this._transisQueueUpdate); });
        }
      }

      object.off('*', this._transisSyncState);
    }
  };
};

