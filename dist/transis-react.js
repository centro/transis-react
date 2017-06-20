(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("ReactDOM"), require("Transis"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "ReactDOM", "Transis"], factory);
	else if(typeof exports === 'object')
		exports["transis_react"] = factory(require("React"), require("ReactDOM"), require("Transis"));
	else
		root["transis_react"] = factory(root["React"], root["ReactDOM"], root["Transis"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(3);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _transis = __webpack_require__(4);

var _transis2 = _interopRequireDefault(_transis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// copied from transis
var nextId = 1;
var updateLog = {};
var updateQueue = {};

function componentCmp(a, b) {
  if (a._transisId < b._transisId) {
    return -1;
  } else if (a._transisId > b._transisId) {
    return 1;
  } else {
    return 0;
  }
}

function preFlush() {
  updateLog = {};
  _transis2.default.Object.delay(postFlush);
}

function postFlush() {
  var components = [];

  for (var id in updateQueue) {
    components.push(updateQueue[id]);
    delete updateQueue[id];
  }

  // Sort the components by their assigned _transisId. Since components get mounted from the top
  // down, this should ensure that parent components are force updated before any descendent
  // components that also need an update. This avoids the case where we force update a component
  // and then force update one of its ancestors, which may unnecessarily render the component
  // again.
  components.sort(componentCmp).forEach(function (component) {
    if (!updateLog[component._transisId] && _reactDom2.default.findDOMNode(component)) {
      // has mounted
      component.forceUpdate();
    }
  });

  _transis2.default.Object.delayPreFlush(preFlush);
}

function queueUpdate(component) {
  updateQueue[component._transisId] = component;
}

function logUpdate(component) {
  updateLog[component._transisId] = true;
}

_transis2.default.Object.delayPreFlush(preFlush);

// end of copied from transis


// component will mount factory
var ComponentWillMountFactory = function ComponentWillMountFactory(_ref) {
  var _this = this;

  var global = _ref.global,
      state = _ref.state,
      props = _ref.props;

  if (state || props) {
    // setting transis id
    this._transisId = this._transisId || nextId++;
    // setting main update function
    this._transisQueueUpdate = this._transisQueueUpdate || function () {
      queueUpdate(_this);
    };
  }
  if (state) {
    // core register sync method
    this._transisSyncState = function () {
      console.warn('transis sync update triggered');
      var stateToUpdate = {};

      var _loop = function _loop(k) {
        if (_this.state[k] !== global[k]) {

          // local state is out of date, off syncing it
          if (_this.state[k] && typeof _this.state[k].off === 'function') {
            state[k].forEach(function (path) {
              return _this.state[k].off(path, _this._transisQueueUpdate);
            });
          }

          // global state needs to be attached, on syncing it
          if (global[k] && typeof global[k].on === 'function') {
            state[k].forEach(function (path) {
              global[k].on(path, _this._transisQueueUpdate);
            });
          }

          stateToUpdate[k] = global[k];
        }
      };

      for (var k in state) {
        _loop(k);
      } // end of for loop
      if (Object.keys(stateToUpdate).length) {
        _this.setState(stateToUpdate);
      }
    };

    var _loop2 = function _loop2(k) {
      // loop through states, on sync all states initially
      if (global[k] && typeof global[k].on === 'function') {
        // global global
        state[k].forEach(function (path) {
          global[k].on(path, _this._transisQueueUpdate);
        });
      }
    };

    for (var k in state) {
      _loop2(k);
    }

    global.on('*', this._transisSyncState);
  }

  if (props) {
    var _loop3 = function _loop3(k) {
      props[k].forEach(function (prop) {
        if (this.props[k]) {
          this.props[k].on(prop, this._transisQueueUpdate);
        }
      }, _this);
    };

    for (var k in props) {
      _loop3(k);
    }
  }
}; // end of Component Will Mount Factory

function transisAware(_ref2, ComposedComponent) {
  var global = _ref2.global,
      state = _ref2.state,
      props = _ref2.props;

  var higherOrderComponent = function (_React$Component) {
    _inherits(HigherOrderComponent, _React$Component);

    function HigherOrderComponent(propArgs) {
      _classCallCheck(this, HigherOrderComponent);

      // allow both component will mount to get triggered
      var _this2 = _possibleConstructorReturn(this, (HigherOrderComponent.__proto__ || Object.getPrototypeOf(HigherOrderComponent)).call(this, propArgs));

      _this2.componentWillMount = function () {
        return ComponentWillMountFactory.call(_this2, {
          global: global, state: state, props: props
        }
        // if (props) {
        // propsMixin.componentWillMount.apply(this,arguments);
        // }
        );
      }; //  end of componentWillMount

      _this2.componentDidMount = function () {
        _this2._isMounted = true;
        logUpdate(_this2);
      };

      _this2.componentDidUpdate = function () {
        logUpdate(_this2);
      };

      _this2.componentWillUnmount = function () {
        if (state) {
          var _loop4 = function _loop4(k) {
            if (_this2.state[k] && typeof _this2.state[k].off === 'function') {
              state[k].forEach(function (path) {
                return _this2.state[k].off(path, _this2._transisQueueUpdate);
              });
            }
          };

          for (var k in state) {
            _loop4(k);
          }
          global.off('*', _this2._transisSyncState);
        }
        if (props) {
          var _loop5 = function _loop5(k) {
            props[k].forEach(function (prop) {
              if (this.props[k]) {
                this.props[k].off(prop, this._transisQueueUpdate);
              }
            }, _this2);
          };

          for (var k in props) {
            _loop5(k);
          }
        }
      };

      if (state) {
        // initialize State, and props
        _this2.state = Object.keys(state).reduce(function (result, key) {
          result[key] = global[key];
          return result;
        }, {}
        // console.debug('intialized state to', this.state)
        );
      }
      if (props) {
        _this2.componentWillReceiveProps = function (nextProps) {
          var _loop6 = function _loop6(k) {
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

          // console.debug('component will receive props', nextProps)
          for (var k in props) {
            _loop6(k);
          }
        };
      }
      return _this2;
    }

    _createClass(HigherOrderComponent, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(ComposedComponent, _extends({}, this.props, this.state));
      }
    }]);

    return HigherOrderComponent;
  }(_react2.default.Component);
  return higherOrderComponent;
}

exports.default = transisAware;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transisAware = __webpack_require__(0);

var _transisAware2 = _interopRequireDefault(_transisAware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _transisAware2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ })
/******/ ]);
});