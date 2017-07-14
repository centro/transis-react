import _React, { Component } from 'react'
import _Transis from 'transis'
import { JSDOM } from 'jsdom'
import { shallow, mount, render } from 'enzyme'

// setup for enzyme to mount
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');


// NOTE: Should not be reliant on these global vars, stubbed out and fake
const copyProps = (src, target) => {
  Object.defineProperties(
    target,
    Object.getOwnPropertyNames(src)
      .filter(prop => typeof target[prop] === 'undefined')
      .map(prop => Object.getOwnPropertyDescriptor(src, prop)
    )
  );
}

copyProps(jsdom.window, global); // making the jsdom.window more global like
global.window = jsdom.window;
global.document = jsdom.window.document;
global.navigator = { userAgent: 'node.js' };
global.frames = [
  { document: { write() {} } },
  { document: { write() {} } }
]
// END OF BAD GLOBALS


// Legit Global Vars
global.shallow = shallow
global.render = render
global.mount = mount
React = _React
Transis = _Transis

// replacement for window variables that you really want to share!
mundo = {}