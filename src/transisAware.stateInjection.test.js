import transisAwareStateInjection from './transisAware.stateInjection'
import React from 'react'
import Transis from 'transis'
import {
  Model, CoreComponent, TransisObjectFactory,
  initial_state_expectation, state_change_sequence_expectation,
} from './test_helper/testUtil'

import { updateQueue, updateLog } from './helper'

describe('state mixin', () => {
  const person = new (TransisObjectFactory('name', 'age'))({
    name: 'john', age: 17
  })

  const appState = new (TransisObjectFactory('person'))({
    person: person
  })

  const Component = transisAwareStateInjection({
    global: appState,
    state: {
      person: ['name']
    }
  }, class ComponentCore extends React.Component {
    render() {
      return <div>
        <h1 className="title">{this.props.title}</h1>
        <p className="person">
          {this.state.person.name}: {this.state.person.age}
        </p>
        <button className="addA"
          onClick={() => appState.person.name += 'A'}
        />
        <button className="ageThePerson"
          onClick={() => appState.person.age++ }
        />
      </div>
    }
  })

  let component
  beforeEach(() => { component = mount(<Component title="john's age"/>) })
  afterEach(() => component.unmount())

  it('mixes state with props', () => {
    // initial check
    expect(component.find('.title').text()).toBe("john's age")
    expect(component.find('.person').text()).toBe("john: 17")

    // check state mixin
    component.find('.addA').simulate('click')
    Transis.Object.flush()
    expect(appState.person.name).toBe('johnA')
    expect(component.find('.person').text()).toBe("johnA: 17")

    component.find('.addA').simulate('click')
    Transis.Object.flush()
    expect(component.find('.person').text()).toBe("johnAA: 17")

    // no mixin for age
    component.find('.ageThePerson').simulate('click')
    Transis.Object.flush()
    expect(component.find('.person').text()).toBe("johnAA: 17")
  })
})

describe('props mixin', () => {
  const Component = transisAwareStateInjection({
    props: {
      person: ['age']
    }
  }, class ComponentCore extends React.Component {
    render() {
      const { person } = this.props;
      return <div>
        <h1 className="title">{this.props.title}</h1>
        <p className="person">
          {person.name}: {person.age}
        </p>
        <button className="addA"
          onClick={() => person.name += 'A'}
        />
        <button className="ageThePerson"
          onClick={() => person.age++ }
        />
      </div>
    }
  })

  const person = new (TransisObjectFactory('name', 'age'))({
    name: 'john', age: 17
  })
  let component

  beforeEach(() => {
    component = mount(<Component person={person} title="john's age: "/>)
  })
  afterEach(() => component.unmount())

  it('mixes state with props', () => {
    expect(component.text()).toBe(
      "john's age: john: 17"
    )

    // check props mixin
    component.find('.addA').simulate('click')
    Transis.Object.flush()
    expect(person.name).toBe('johnA')
    expect(component.find('.person').text()).toBe("john: 17") // should not update due to no mixin given to name


    component.find('.ageThePerson').simulate('click')
    Transis.Object.flush()
    expect(component.find('.person').text()).toBe("johnA: 18") // should not update due to no mixin given to name
  })
})