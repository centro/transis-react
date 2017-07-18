import Transis from 'transis'

let nextId = 1;
const getId = () => nextId++;

// @param {component}<ReactComponent> - component that needs _transisId
const assignTransisIdTo = component => {
  component._transisId = component._transisId || getId()
}

let updateLog = {}; // used to keep track of what's been updated
let updateQueue = {}; // used as a register for components that needs update

export const componentComparison = (a, b) => {
  if (a._transisId < b._transisId) { return -1; }
  else if (a._transisId > b._transisId) { return 1; }
  else { return 0; }
}

// registers preFlush to be invoked before the next flush cycle
const registerDelayPreFlush = () =>
  Transis.Object.delayPreFlush(function preFlush() {
    updateLog = {};
    registerDelayPostFlush(); // registers postFlush to be invoked after next flush cycle
  })


const registerDelayPostFlush = () =>
  Transis.Object.delay(function postFlush() {
    let components = []; // registry for which components needs to be re-rendered

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
      if (!updateLog[component._transisId]) {
        component.forceUpdate();
      }
    });

    registerDelayPreFlush()
  })

const queueUpdate = component => {
  // console.warn('queueUpdate')
  updateQueue[component._transisId] = component;
}

const unqueueUpdate = component => {
  delete updateQueue[component._transisId]
}

const logUpdate = component => updateLog[component._transisId] = true

// first register to kick off the cycle
registerDelayPreFlush()

export {
  assignTransisIdTo,

  queueUpdate,
  unqueueUpdate,
  updateQueue,

  logUpdate,
  updateLog,
}
