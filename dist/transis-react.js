(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react-dom"), require("transis"), require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react-dom", "transis", "react"], factory);
	else if(typeof exports === 'object')
		exports["transis-react"] = factory(require("react-dom"), require("transis"), require("react"));
	else
		root["transis-react"] = factory(root["react-dom"], root["transis"], root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateLog = exports.logUpdate = exports.updateQueue = exports.queueUpdate = exports.assignTransisIdTo = exports.componentComparison = undefined;

var _transis = __webpack_require__(2);

var _transis2 = _interopRequireDefault(_transis);

var _reactDom = __webpack_require__(1);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nextId = 1;
var getId = function getId() {
  return nextId++;
};

// @param {component}<ReactComponent> - component that needs _transisId
var assignTransisIdTo = function assignTransisIdTo(component) {
  component._transisId = component._transisId || getId();
};

var updateLog = {}; // used to keep track of what's been updated
var updateQueue = {}; // used as a register for components that needs update

var componentComparison = exports.componentComparison = function componentComparison(a, b) {
  if (a._transisId < b._transisId) {
    return -1;
  } else if (a._transisId > b._transisId) {
    return 1;
  } else {
    return 0;
  }
};

// registers preFlush to be invoked before the next flush cycle
var registerDelayPreFlush = function registerDelayPreFlush() {
  return _transis2.default.Object.delayPreFlush(function preFlush() {
    exports.updateLog = updateLog = {};
    registerDelayPostFlush(); // registers postFlush to be invoked after next flush cycle
  });
};

var registerDelayPostFlush = function registerDelayPostFlush() {
  return _transis2.default.Object.delay(function postFlush() {
    var components = []; // registry for which components needs to be re-rendered

    for (var id in updateQueue) {
      components.push(updateQueue[id]);
      delete updateQueue[id];
    }

    // Sort the components by their assigned _transisId. Since components get mounted from the top
    // down, this should ensure that parent components are force updated before any descendent
    // components that also need an update. This avoids the case where we force update a component
    // and then force update one of its ancestors, which may unnecessarily render the component
    // again.
    components.sort(componentComparison).forEach(function (component) {
      try {
        // TODO: figureout why this doesn't work with provider
        var hasMounted = _reactDom2.default.findDOMNode(component);
      } catch (e) {
        console.warn('TransisAware attempted to update an unmounted component: ' + component);
      }

      if (!updateLog[component._transisId] && hasMounted) {
        component.forceUpdate();
      }
    });

    registerDelayPreFlush();
  });
};

var queueUpdate = function queueUpdate(component) {
  // console.warn('queueUpdate')
  updateQueue[component._transisId] = component;
};

var logUpdate = function logUpdate(component) {
  return updateLog[component._transisId] = true;
};

// first register to kick off the cycle
registerDelayPreFlush();

exports.assignTransisIdTo = assignTransisIdTo;
exports.queueUpdate = queueUpdate;
exports.updateQueue = updateQueue;
exports.logUpdate = logUpdate;
exports.updateLog = updateLog;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StateMixin = exports.PropsMixin = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; //  support


var _helper = __webpack_require__(0);

// Legacy Prop Mixin
var PropsMixin = exports.PropsMixin = function PropsMixin(props) {
  return {
    componentWillMount: function componentWillMount() {
      var _this = this;

      (0, _helper.assignTransisIdTo)(this);
      this._transisQueueUpdate = this._transisQueueUpdate || function () {
        (0, _helper.queueUpdate)(_this);
      };

      var _loop = function _loop(k) {
        props[k].forEach(function (prop) {
          if (this.props[k]) {
            this.props[k].on(prop, this._transisQueueUpdate);
          }
        }, _this);
      };

      for (var k in props) {
        _loop(k);
      }
    },

    componentDidMount: function componentDidMount() {
      (0, _helper.logUpdate)(this);
    },

    componentDidUpdate: function componentDidUpdate() {
      (0, _helper.logUpdate)(this);
    },

    componentWillUnmount: function componentWillUnmount() {
      var _this2 = this;

      var _loop2 = function _loop2(k) {
        props[k].forEach(function (prop) {
          if (this.props[k]) {
            this.props[k].off(prop, this._transisQueueUpdate);
          }
        }, _this2);
      };

      for (var k in props) {
        _loop2(k);
      }
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      var _loop3 = function _loop3(k) {
        props[k].forEach(function (prop) {
          if (nextProps[k] !== this.props[k]) {
            if (this.props[k]) {
              this.props[k].off(prop, this._transisQueueUpdate);
            }
            if (nextProps[k]) {
              nextProps[k].on(prop, this._transisQueueUpdate);
            }
          }
        }, _this3);
      };

      for (var k in props) {
        _loop3(k);
      }
    }
  };
};

//  State Mixin
var StateMixin = exports.StateMixin = function StateMixin() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var object = args[0],
      props = args[1];

  if ((typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object') {
    // convert prop into into an object of empty arrays
    // e.g.
    // StateMixin({}, 'a', 'b', 'c') -> props become { a: [], b: [], c: [] }
    props = [].slice.call(args, 1).reduce(function (acc, prop) {
      acc[prop] = [];
      return acc;
    }, {});
  }

  return {
    getInitialState: function getInitialState() {
      var state = {};
      for (var k in props) {
        state[k] = object[k];
      }
      return state;
    },

    componentWillMount: function componentWillMount() {
      var _this4 = this;

      (0, _helper.assignTransisIdTo)(this);
      this._transisQueueUpdate = this._transisQueueUpdate || function () {
        (0, _helper.queueUpdate)(_this4);
      };

      this._transisSyncState = function () {
        var state = {};

        // for appstate variables, loop

        var _loop4 = function _loop4(k) {
          if (_this4.state[k] !== object[k]) {
            // if the var is changed
            // if local state var exist and it can `off`?!, turn off the update watcher
            if (_this4.state[k] && typeof _this4.state[k].off === 'function') {
              props[k].forEach(function (path) {
                _this4.state[k].off(path, _this4._transisQueueUpdate);
              });
            }

            // if global state var exist and it can `on`?!, turn on update watcher
            if (object[k] && typeof object[k].on === 'function') {
              props[k].forEach(function (path) {
                object[k].on(path, _this4._transisQueueUpdate);
              });
            }

            state[k] = object[k]; // prepare to attach global var to local var
          }
        };

        for (var k in props) {
          _loop4(k);
        }

        if (Object.keys(state).length) {
          _this4.setState(state);
        } // update if there is a need
      };

      var _loop5 = function _loop5(k) {
        // loop through states, on sync all states initially
        if (object[k] && typeof object[k].on === 'function') {
          // global object
          props[k].forEach(function (path) {
            object[k].on(path, _this4._transisQueueUpdate);
          });
        }
      };

      for (var k in props) {
        _loop5(k);
      }

      object.on('*', this._transisSyncState);
    },

    componentDidMount: function componentDidMount() {
      (0, _helper.logUpdate)(this);
    },

    componentDidUpdate: function componentDidUpdate() {
      (0, _helper.logUpdate)(this);
    },

    componentWillUnmount: function componentWillUnmount() {
      var _this5 = this;

      var _loop6 = function _loop6(k) {
        if (_this5.state[k] && typeof _this5.state[k].off === 'function') {
          props[k].forEach(function (path) {
            _this5.state[k].off(path, _this5._transisQueueUpdate);
          });
        }
      };

      for (var k in props) {
        _loop6(k);
      }

      object.off('*', this._transisSyncState);
    }
  };
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(6);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(1);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _transis = __webpack_require__(2);

var _transis2 = _interopRequireDefault(_transis);

var _helper = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Note: not exactly sure when this is needed: work around for this multiple instance issue
// let mundo; try { mundo = window } catch (e) { mundo = global }
// const Transis = mundo.Transis || MyTransis

// copied from transis


// * Refactor Effort *
// @param {TransisObject} globalTransisObjectVar - transis object attached to some globalTransisObject namespace
// @param {Array} attrsToWatch - props on the globalTransisObjectVar that the component should watch for
var bindState = function bindState(globalTransisObjectVar, attrsToWatch, callback) {
  if (globalTransisObjectVar && typeof globalTransisObjectVar.on === 'function') {
    attrsToWatch.forEach(function (attrPath) {
      return globalTransisObjectVar.on(attrPath, callback);
    });
  }
};

var unbindState = function unbindState(stateVar, attrsToWatch, callback) {
  if (stateVar && typeof stateVar.off === 'function') {
    attrsToWatch.forEach(function (attrPath) {
      return stateVar.off(attrPath, callback);
    });
  }
};

var unbindProps = function unbindProps(propsVar, attrsToWatch, callback) {
  attrsToWatch.forEach(function (attrPath) {
    return propsVar && propsVar.off(attrPath, callback);
  });
};

var bindProps = function bindProps(propsVar, attrsToWatch, callback) {
  attrsToWatch.forEach(function (attrPath) {
    return propsVar && propsVar.on(attrPath, callback);
  });
};

// component will mount
var componentWillMount = function componentWillMount(_ref) {
  var _this = this;

  var globalTransisObject = _ref.globalTransisObject,
      state = _ref.state,
      props = _ref.props;

  if (state || props) {
    // setting transis id
    (0, _helper.assignTransisIdTo)(this

    // setting main update function
    );var wrapQueueUpdate = function wrapQueueUpdate() {
      (0, _helper.queueUpdate)(_this);
    }; // name this function
    this._transisQueueUpdate = this._transisQueueUpdate || wrapQueueUpdate;
  }
  if (state) {
    // core register sync method
    this._transisSyncState = function () {
      // console.warn('transis sync update triggered')

      var stateToUpdate = {};
      for (var k in state) {
        if (_this.state[k] !== globalTransisObject[k]) {
          // local state is out of date, off syncing it
          unbindState(_this.state[k], state[k], _this._transisQueueUpdate

          // globalTransisObject state needs to be attached, on syncing it
          );bindState(globalTransisObject[k], state[k], _this._transisQueueUpdate);

          stateToUpdate[k] = globalTransisObject[k];
        }
      } // end of for loop

      if (Object.keys(stateToUpdate).length) {
        _this.setState(stateToUpdate);
      }
    };

    for (var k in state) {
      // loop through states, on sync all states initially
      bindState(globalTransisObject[k], state[k], this._transisQueueUpdate);
    }

    globalTransisObject.on('*', this._transisSyncState);
  }

  if (props) {
    for (var _k in props) {
      bindProps(this.props[_k], props[_k], this._transisQueueUpdate);
    }
  }
}; // end of Component Will Mount Factory
// * end Refactor Effort *

// main constructor
var transisAware = function transisAware(_ref2, ComposedComponent) {
  var globalTransisObject = _ref2.global,
      state = _ref2.state,
      props = _ref2.props;

  if (!globalTransisObject && state) {
    throw new Error("Cannot compose with-state component without global transis object, state: ", state);
  }

  // convert prop into into an object of empty arrays
  // e.g. StateMixin({}, 'a', 'b', 'c') -> props {}= { a: [], b: [], c: [] }
  if ({}.toString.call(state).includes('Array')) {
    // is an array
    state = state.reduce(function (obj, stateName) {
      obj[stateName] = [];
      return obj;
    }, {});
  }

  var higherOrderComponent = function (_React$Component) {
    _inherits(HigherOrderComponent, _React$Component);

    // allow both component will mount to get triggered
    // debugMode = false
    function HigherOrderComponent(propArgs) {
      _classCallCheck(this, HigherOrderComponent);

      // if (propArgs.debug) { this.debugMode = true }

      var _this2 = _possibleConstructorReturn(this, (HigherOrderComponent.__proto__ || Object.getPrototypeOf(HigherOrderComponent)).call(this, propArgs));

      _this2.componentWillMount = function () {
        // this.debugMode && console.warn('component will mount', this._transisId)
        return componentWillMount.call(_this2, {
          globalTransisObject: globalTransisObject, state: state, props: props
        });
      };

      _this2.componentDidMount = function () {
        // this.debugMode && console.warn('component did mounted', this._transisId)
        _this2.haveMounted = true;
        (0, _helper.logUpdate)(_this2);
      };

      _this2.componentDidUpdate = function () {
        // this.debugMode && console.warn('component did update', this._transisId)
        (0, _helper.logUpdate)(_this2);
      };

      _this2.componentWillUnmount = function () {
        // this.debugMode && console.warn('component will unmount', this._transisId)
        _this2.haveUnmounted = true;
        if (state) {
          for (var k in state) {
            unbindState(_this2.state[k], state[k], _this2._transisQueueUpdate);
          }
          globalTransisObject.off('*', _this2._transisSyncState);
        }
        if (props) {
          for (var _k2 in props) {
            unbindProps(_this2.props[_k2], props[_k2], _this2._transisQueueUpdate);
          }
        }
      };

      _this2.render = function () {
        return _react2.default.createElement(ComposedComponent, _extends({}, _this2.props, _this2.state));
      };

      if (state) {
        // initialize State
        _this2.state = Object.keys(state).reduce(function (result, key) {
          result[key] = globalTransisObject[key];
          return result;
        }, {});
      }
      if (props) {
        _this2.componentWillReceiveProps = function (nextProps) {
          var _loop = function _loop(k) {
            props[k].forEach(function (prop) {
              if (nextProps[k] !== _this2.props[k]) {
                if (_this2.props[k]) {
                  _this2.props[k].off(prop, _this2._transisQueueUpdate);
                }
                if (nextProps[k]) {
                  nextProps[k].on(prop, _this2._transisQueueUpdate);
                }
              }
            });
          };

          // console.warn('component will receive props', nextProps)
          for (var k in props) {
            _loop(k);
          }
        };
      }
      return _this2;
    }

    return HigherOrderComponent;
  }(_react2.default.Component);
  return higherOrderComponent;
};

transisAware.Transis = _transis2.default; // for verifying Transis instances

transisAware.updateLog = _helper.updateLog; // for debugging purposes
transisAware.updateQueue = _helper.updateQueue;

exports.default = transisAware;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropsMixin = exports.StateMixin = undefined;

var _transisAware = __webpack_require__(4);

var _transisAware2 = _interopRequireDefault(_transisAware);

var _TransisReactMixin = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _transisAware2.default;
exports.StateMixin = _TransisReactMixin.StateMixin;
exports.PropsMixin = _TransisReactMixin.PropsMixin;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ })
/******/ ]);
});