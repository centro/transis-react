import React, { Component } from 'react'
import { StateMixin, PropsMixin } from 'transis-react'

const AuthorAge = React.createClass({
  mixins: [
    PropsMixin({
      author: ['age']
    })
  ],
  render() {
    return <span>{this.props.author.age}</span>
  }
})

const AppLegacy = React.createClass({
  mixins: [
    StateMixin(window.globalObj, {
      book: ['name', 'author.name', 'pages']
    })
  ],

  render() {
    const { book: { name, pages, author } } = this.state
    const { constant } = this.props

    return <div>
      <p> CONSTANT PROP: { constant } </p>
      <p> Book: {name} </p>
      <p> Book: {pages} </p>
      <p> Author: {author.name}, <AuthorAge author={author} /> </p>
    </div>
  }
})
export default AppLegacy

// smart mixin
export const Clock = React.createClass({
  mixins: [
    StateMixin(window.globalObj, 'time')
  ],
  render() {
    return <span>
      {this.state.time && this.state.time.toLocaleTimeString()}
    </span>
  }
})
