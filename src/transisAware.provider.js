import React from 'react'
import transisAware from './transisAware'

const TransisProvider = (props) => {
  const { global, mixState, mixProps, children, ...otherProps } = props

  const HigherOrderProvider = transisAware({
    global,
    state: mixState,
    props: mixProps
  }, coreProps => {
    // TODO: throw error here if conflict occurs, betweeen props and other props should be fine

    return <children.type {...children.props} {...coreProps} />
    // return React.cloneElement(children, coreProps) // equivalent, preserves refs
  })

  return <HigherOrderProvider {...otherProps}/>
}

export default TransisProvider