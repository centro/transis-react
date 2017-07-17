import transisAware from './transisAware'
import { PropsMixin, StateMixin } from './TransisReactMixin'

import {
  Model, CoreComponent, TransisObjectFactory,
} from './test_helper/testUtil'


let component
describe('Mix Usage: ', () => {
  const model = new Model
  const MixinComponent = React.createClass({
    mixins: [ PropsMixin({ model: ['name'] }) ],
    render: () => <p>mixin comp</p>
  })

  const AwareComponent = transisAware(
    { props: { model: ['name'] } }, 
    class AwareComponentCore extends React.Component {
      render() {
        const { model } = this.props
        return <div>
          {model.name}
          <MixinComponent ref={mix1 => this.mix1 = mix1} model={model}/>
          <AwareComponent2 ref={aware2 => this.aware2 = aware2}/> 
          <MixinComponent ref={mix2 => this.mix2 = mix2} model={model}/>
        </div>
      }
    }
  )
  const AwareComponent2 = transisAware(
    { props: { name: [] }}, () => <p>aware comp 2</p>
  )

  it('should share _transisId as it increments', () => {
    component = mount(<AwareComponent model={model}/>)
    expect(component.node._transisId).toBe(1)
    expect(component.node.core.mix1._transisId).toBe(2)
    expect(component.node.core.aware2._transisId).toBe(3)
    expect(component.node.core.mix2._transisId).toBe(4)
  })
})
