import React from 'react'
import { Route } from 'react-router-dom'
export const GuardedRoute = props => {
  props.beforeRender()
  delete props.callback
  return <Route {...props}></Route>
}
