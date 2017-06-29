(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("transis"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "transis"], factory);
	else if(typeof exports === 'object')
		exports["transis-react"] = factory(require("react"), require("react-dom"), require("transis"));
	else
		root["transis-react"] = factory(root["react"], root["react-dom"], root["transis"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
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
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(3);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(4);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _transis = __webpack_require__(5);

var _transis2 = _interopRequireDefault(_transis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var globalVar = void 0;
try {
  globalVar = window;
} catch (e) {
  globalVar = global;
}

// TODO: work around for this multiple instance issue
var Transis = globalVar.Transis || _transis2.default;

// for debugging purpose
globalVar.VigilantTransis = Transis;

// globalTransisObjectConfig
var defaultGlobalTransisObject = null;

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
  Transis.Object.delay(postFlush);
}

function postFlush() {
  var components = [];

  console.warn('post flush triggered');
  for (var id in updateQueue) {
    components.push(updateQueue[id]);
    delete updateQueue[id];
  }

  // Sort the components by their assigned _transisId. Since components get mounted from the top
  // down, this should ensure that parent components are force updated before any descendent
  // components that also need an update. This avoids the case where we force update a component
  // and then force update one of its ancestors, which may unnecessarily render the component
  // again.
  try {
    components.sort(componentCmp).forEach(function (component) {
      if (!updateLog[component._transisId] && _reactDom2.default.findDOMNode(component)) {
        // has mounted
        component.forceUpdate();
      }
    });
  } catch (e) {
    console.warn(e);
    console.warn(2);
  }
  Transis.Object.delayPreFlush(preFlush);
}

function queueUpdate(component) {
  console.warn('queueUpdate');
  updateQueue[component._transisId] = component;
}

function logUpdate(component) {
  updateLog[component._transisId] = true;
}

Transis.Object.delayPreFlush(preFlush);

// end of copied from transis


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
  var global = _ref2.global,
      state = _ref2.state,
      props = _ref2.props;

  var globalTransisObject = global || defaultGlobalTransisObject;
  if (!globalTransisObject && state) {
    throw new Error("Cannot compose with-state component without global transis object, state: ", state);
  }
  var higherOrderComponent = function (_React$Component) {
    _inherits(HigherOrderComponent, _React$Component);

    function HigherOrderComponent(propArgs) {
      _classCallCheck(this, HigherOrderComponent);

      // consider move the following into instance methods

      // allow both component will mount to get triggered
      var _this2 = _possibleConstructorReturn(this, (HigherOrderComponent.__proto__ || Object.getPrototypeOf(HigherOrderComponent)).call(this, propArgs));

      _this2.componentWillMount = function () {
        return componentWillMount.call(_this2, {
          globalTransisObject: globalTransisObject, state: state, props: props
        });
      };

      _this2.componentDidMount = function () {
        logUpdate(_this2);
      };

      _this2.componentDidUpdate = function () {
        logUpdate(_this2);
      };

      _this2.componentWillUnmount = function () {
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

      if (state) {
        // initialize State
        _this2.state = Object.keys(state).reduce(function (result, key) {
          result[key] = globalTransisObject[key];
          return result;
        }, {}
        // console.warn('intialized state to', this.state)
        );
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

    _createClass(HigherOrderComponent, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(ComposedComponent, _extends({}, this.props, this.state));
      }
    }]);

    return HigherOrderComponent;
  }(_react2.default.Component);
  return higherOrderComponent;
};

transisAware.Transis = Transis; // for debugging
exports.default = transisAware;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

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

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ })
/******/ ]);
});