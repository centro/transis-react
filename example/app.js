import './app.css'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import Transis from 'transis'

// import transisAware from '../src/index' // // TODO: not working, get it to work
import transisAware from 'transis-react' // // TODO: not working, get it to work

window.transisAware = transisAware // avoid importing in other components

const fakeString = n => Array.from(Array(n || 10).keys()).map(n =>  String.fromCharCode(Math.floor(Math.random()*26) + 97)).join('')

// debugging purpose
window.Transis = Transis

// model setup
window.globalObj = new (Transis.Object.extend(function() {
  this.prop('time')
  this.prop('book')
  this.prop('author')
}))

const Book = Transis.Model.extend('Book', function() {
  this.attr('name', 'string')
  this.prop('pages')
  this.hasOne('author', 'Author', { inverse: 'books' })
})

const Author = Transis.Model.extend('Author', function() {
  this.attr('name', 'string')
  this.attr('age', 'number')
  this.hasMany('books', 'Book', { inverse: 'author' })
})
// end of models


// model setups
globalObj.time = new Date
setInterval(() =>
  globalObj.time = new Date, // to string with .toLocaleTimeString()
  1000
)

globalObj.book = new Book({
  name: 'A catcher in the rye',
  pages: 354,
  author: new Author({
    name: 'Salinger',
    age: 37
  })
})
// end of model setup


// components
const _AuthorAge = transisAware(
  { props: { author: ['age'] } },
  ({ author: { age } }) => <span>{age}</span>
)

const App = transisAware(
  {
    global: globalObj,
    state: {
      book: ['name', 'author.name', 'pages']
    },
  },
  class AppCore extends Component {
    render() {
      const { book: { name, pages, author }, constant } = this.props

      return <div>
        <p> CONSTANT PROP: { constant } </p>
        <p> Book: {name} </p>
        <p> Book: {pages} </p>
        <p> Author: {author.name}, <_AuthorAge author={author} /> </p>
      </div>
    }
  }
)

// smart mixin
const Clock = transisAware(
  { global: globalObj, state: ['time'] },
  ({ time }) => <span> {time && time.toLocaleTimeString()} </span>
)

const { default: Legacy, Clock: ClockLegacy } = require('./app.legacy')
const { default: Provider, Clock: ClockProvider } = require('./app.provider')
const { default: StateInjection, Clock: ClockStateInjection } = require('./app.stateInjection')

ReactDOM.render(
  <div>
    <h1>React Transis Binding</h1>

    <fieldset>
      <legend><h2> Nouveau -- <Clock/> </h2></legend>
      <App constant="Its a constant!" />
    </fieldset>
    <br/> <br/>

    <fieldset>
      <legend> <h2>Legacy -- <ClockLegacy/> </h2></legend>
      <Legacy constant="Its a constant!"/>
    </fieldset>
    <br/> <br/>

    <fieldset>
      <legend><h2> Provider -- <ClockProvider/></h2></legend>
      <Provider constant="Its a constant!"/>
    </fieldset>
    <br/> <br/>

    <fieldset>
      <legend><h2> State Injection -- <ClockStateInjection/></h2></legend>
      <StateInjection constant="Its a constant!"/>
    </fieldset>
    <br/> <br/>

    <fieldset>
      <legend><h3>Controls</h3></legend>
      <button onClick={() => globalObj.book.name = fakeString(10)}>
        Change book title
        <div>state - attr</div>
      </button>

      <button onClick={() => globalObj.book.pages = Math.floor(Math.random()*500)}>
        Change book pages
        <div>state - prop</div>
      </button>

      <button onClick={() => globalObj.book.author.name = fakeString(10)}>
        Change author name
        <div>state - association - primitive</div>
      </button>
      <button onClick={() =>
        globalObj.book.author.age = Math.floor(Math.random() * 100)
      }>
        Change author age
        <div>props - attr</div>
      </button>
    </fieldset>
  </div>,
  document.getElementById('app')
)
