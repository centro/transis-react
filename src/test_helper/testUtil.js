// @params [...attrs] - strings
export const TransisObjectFactory = (...attrs) => {
  return Transis.Object.extend(function() {
    attrs.forEach(
      atr => this.prop(atr)
    )
  })
}

export const Simpleton = TransisObjectFactory('name')

export const Model = Transis.Object.extend(function() {
  this.prop('foo')
  this.prop('bar')
  this.prop('baz')
  this.prototype.reset = function() {
    this.foo = 'foo 1';
    this.bar = 'bar 1';
    this.baz = 'baz 1';
    Transis.Object.flush()
  }
})

export const CoreComponent = ({
  model: { foo, bar, baz }
}) => <div>
  <div className="foo">{foo}</div>
  <div className="bar">{bar}</div>
  <div className="baz">{baz}</div>
</div>

export const initial_state_expectation = ({ component }) => {
  expect(component.find('.foo').text()).toBe('foo 1')
  expect(component.find('.bar').text()).toBe('bar 1')
  expect(component.find('.baz').text()).toBe('baz 1')
}

export const state_change_sequence_expectation = ({ model, component }) => {
  model.foo = 'foo 2'
  Transis.Object.flush()
  expect(component.find('.foo').text()).toBe('foo 1')

  model.bar = 'bar 2'
  Transis.Object.flush()
  expect(component.find('.bar').text()).toBe('bar 1')

  model.baz = 'baz 2'
  Transis.Object.flush()
  expect(component.find('.foo').text()).toBe('foo 2')
  expect(component.find('.bar').text()).toBe('bar 2')
  expect(component.find('.baz').text()).toBe('baz 2')
}