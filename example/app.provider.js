import React, { Component } from 'react'
const { TransisProvider } = window.transisAware

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
const MainProvider = (props) => {
  return <TransisProvider
    global={window.globalObj}
    mixState={{
      book: ['name', 'author.name', 'pages']
    }}
  >
    <DefaultCore {...props}/>
  </TransisProvider>
}
export default MainProvider

const DefaultCore = ({ book: { name, pages, author }, constant }) => {
  return <div>
    <p> CONSTANT PROP: { constant } </p>
    <p> Book: {name} </p>
    <p> Book: {pages} </p>
    <p> Author: {author.name}, <_AuthorAge author={author} /></p>
  </div>
}

// props mixin

const _AuthorAge = props => {
  return <TransisProvider
    {...props}
    debug
    mixProps={{ author: ['age']}}
  >
    <_AuthorAgeCore/>
  </TransisProvider>
}
const _AuthorAgeCore = ({ author }) => <span>{author.age}</span>