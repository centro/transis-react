import transisAware from './transisAware'

import TransisProvider from './transisAware.provider'

import transisAwareStateInjection from './transisAware.stateInjection'

import {
  StateMixinLegacy as StateMixin,
  PropsMixinLegacy as PropsMixin
} from './transisAware.legacy'


export default transisAware

export {
  StateMixin,
  PropsMixin,
  TransisProvider,
  transisAwareStateInjection,
}