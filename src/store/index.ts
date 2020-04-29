// import redux from 'redux-thunk'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import reducer from '@/reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

const thunk: ThunkMiddleware = thunkMiddleware
const enhancer =
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk)

export default createStore(reducer, enhancer)
