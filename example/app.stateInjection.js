import React, { Component } from 'react'
import { transisAwareStateInjection } from '../src/index'

// smart state mixin
export const Clock = transisAwareStateInjection(
  {
    global: window.globalObj,
    state: ['time']
  }, class ClockCore extends Component {
    render() {
      return <span>
        {this.state.time && this.state.time.toLocaleTimeString()}
      </span>
    }
  },
)

// state mixin
const MainProvider = transisAwareStateInjection(
  {
    global: window.globalObj,
    state: {
      book: ['name', 'author.name', 'pages']
    }
  },
  class DefaultCore extends Component {
    render() {
      const { book: { name, pages, author } } = this.state
      const { constant } = this.props

      return <div>
        <p> CONSTANT PROP: { constant } </p>
        <p> Book: {name} </p>
        <p> Book: {pages} </p>
        <p> Author: {author.name}, <_AuthorAge author={author} /></p>
      </div>
    }
  },
)
export default MainProvider

// props mixin
const _AuthorAge = transisAwareStateInjection(
  {
    props: {
      author: ['age']
    }
  },
  class _AuthorAgeCore extends Component {
    render() {
      return <span>{this.props.author.age}</span>
    }
  },
)