import word from './util'
console.log(word)
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import Transis from 'transis'

window.globalObj = new (Transis.Object.extend('global', function() {
  this.prop('date')
  this.prop('book')
  this.prop('books')
}))

const Book = Transis.Model.extend('Book', function() {
  this.attr('name', 'string')
  this.hasOne('author', 'string')
})

const Author = Transis.Model.extend('Author', function() {
  this.attr('name', 'string')
})

globalObj.name = 'john'
globalObj.book = 'A catcher in the rye'


class App extends Component {
  render() {
    return <h1>App</h1>
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
