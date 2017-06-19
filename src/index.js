import word from './util'
console.log(word)

import './index.css'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import Transis from 'transis'
import transisAware from './transisAware'

// model setup
window.globalObj = new (Transis.Object.extend(function() {
  this.prop('time')
  this.prop('age')
  this.prop('book')
  this.prop('author')
}))

const Book = Transis.Model.extend('Book', function() {
  this.attr('name', 'string')
  this.hasOne('author', 'Author', { inverse: 'books' })
})

const Author = Transis.Model.extend('Author', function() {
  this.attr('name', 'string')
  this.hasMany('books', 'Book', { inverse: 'author' })
})
// end of models

globalObj.time = new Date
// data setup
setInterval(() =>
  globalObj.time = new Date, // to string with .toLocaleTimeString()
  1000
)

globalObj.book = new Book({
  name: 'A catcher in the rye',
  author: new Author({
    name: 'Salinger'
  })
})

// end of data setup


// Component setup
const App = transisAware(
  {
    global: globalObj,
    state: {
      time: [],
      book: ['name']
    },
    // props: []
  },
  class AppCore extends Component {
    render() {
      const {
        time, book = {},
        book: { author = {} } = {}
      } = this.props

      return <div>
        <h1>React Transis</h1>
        <p> Time: {time && time.toLocaleTimeString()} </p>
        <p> Book: {book.name} </p>
        <p> Author: {author.name} </p>
        <button onClick={() => globalObj.author = book.author}>
          Who is the author?
        </button>

        <button onClick={
          () => {}
        }>
          Change book
        </button>

        <button onClick={
          () => {}
        }>
          Change author
        </button>
      </div>
    }
  }
)


ReactDOM.render(
  <App />,
  document.getElementById('app')
)
