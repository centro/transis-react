import './app.css'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import Transis from 'transis'
import transisAware from '../dist/transis-react' // TODO: seems to be the only way to use the same Transis instance.

// import transisAware from 'transis-react' // seems to not work
window.Transis = Transis // for debugging purpose

const fakeString = n => Array.from(Array(n || 10).keys()).map(n =>  String.fromCharCode(Math.floor(Math.random()*26) + 97)).join('')


// model setup
window.globalObj = new (Transis.Object.extend(function() {
  this.prop('time')
  this.prop('book')
  this.prop('author')
}))

const Book = Transis.Model.extend('Book', function() {
  this.attr('name', 'string')
  this.hasOne('author', 'Author', { inverse: 'books' })
})

const Author = Transis.Model.extend('Author', function() {
  this.attr('name', 'string')
  this.attr('age', 'number')
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
    name: 'Salinger',
    age: 37
  })
})

// end of data setup


const AuthorAge = transisAware(
  {
    props: {
      author: ['age']
    }
  },
  class AuthorAgeCore extends Component {
    render() {
      return <span>{this.props.author.age}</span>
    }
  }
)

const App = transisAware(
  {
    global: globalObj,
    state: {
      time: [],
      book: ['name', 'author.name']
    },
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
        <p> Author: {author.name}, <AuthorAge author={author} /> </p>

        <button onClick={() => book.name = fakeString(10)}>
          Change book title
          <div>state - primitive</div>
        </button>

        <button onClick={() => book.author.name = fakeString(10)}>
          Change author name
          <div>state - attr</div>
        </button>
        <button onClick={() =>
          book.author.age = Math.floor(Math.random() * 100)
        }>
          Change author age
          <div>props - attr</div>
        </button>
      </div>
    }
  }
)

ReactDOM.render(
  <App />,
  document.getElementById('app')
)