import React from 'react'
import { Route } from 'react-router-dom'
export const GuardedRoute = props => {
  props.beforeEnter()
  delete props.callback
  return <Route {...props}></Route>
}
