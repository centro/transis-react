import Transis from 'transis'
import ReactDOM from 'react-dom'

let nextId = 1;
let updateLog = {};
let updateQueue = {};

function componentComparison(a, b) {
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

  // console.warn('post flush triggered')
  for (let id in updateQueue) {
    components.push(updateQueue[id]);
    delete updateQueue[id];
  }

  // Sort the components by their assigned _transisId. Since components get mounted from the top
  // down, this should ensure that parent components are force updated before any descendent
  // components that also need an update. This avoids the case where we force update a component
  // and then force update one of its ancestors, which may unnecessarily render the component
  // again.
  components.sort(componentComparison).forEach(function(component) {
    try { // TODO: figureout why this doesn't work with provider
      var hasMounted = ReactDOM.findDOMNode(component)
    } catch(e) {
      console.warn(`TransisAware attempted to update an unmounted component: ${component}`)
    }

    if (!updateLog[component._transisId] && hasMounted) {
      component.forceUpdate();
    }
  });

}

function queueUpdate(component) {
  // console.warn('queueUpdate')
  updateQueue[component._transisId] = component;
}

function logUpdate(component) {
  updateLog[component._transisId] = true;
}

function delayPreFlush() {
  Transis.Object.delayPreFlush(preFlush);
}

delayPreFlush()

export default {
  get getId() {
    return nextId++
  },
}

export {
  queueUpdate, updateQueue,
  logUpdate, updateLog,
  delayPreFlush,
  preFlush,
}
