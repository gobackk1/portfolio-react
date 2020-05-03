import React from 'react'

const Render: React.FC<{ if: any }> = props => {
  return <>{props.if ? props.children : ''}</>
}

export default Render
