import React, { Component } from 'react'
import transisAware, { TransisProvider, StateMixin, PropsMixin } from '../src/index'

// smart state mixin
export const Clock = (props) => {
  return <TransisProvider
    global={window.globalObj}
    mixState={['time']}
  >
    <ClockCore />
  </TransisProvider>
}

const ClockCore = props => <span>
  {props.time && props.time.toLocaleTimeString()}
</span>


// state mixin
export default (props) => {
  return <TransisProvider
    global={window.globalObj}
    mixState={{
      book: ['name', 'author.name', 'pages']
    }}
  >
    <DefaultCore />
  </TransisProvider>
}

const DefaultCore = ({ book: { name, pages, author } }) => {
  return <div>
    <p> Book: {name} </p>
    <p> Book: {pages} </p>
    <p> Author: {author.name}, <_AuthorAge author={author} /></p>
  </div>
}

// props mixin

const _AuthorAge = props => {
  return <TransisProvider
    {...props}
    mixProps={{ author: ['age']}}
  >
    <_AuthorAgeCore/>
  </TransisProvider>
}
const _AuthorAgeCore = ({ author }) => <span>{author.age}</span>