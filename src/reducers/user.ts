import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { login, register, logout, clearError } from '@/actions/user'

const initialState: any = {
  id: 0,
  name: '',
  email: '',
  created_at: '',
  token: '',
  error: null,
  isLogin: false,
  loggingIn: false
}

export default reducerWithInitialState(initialState)
  .cases([login.async.started, register.async.started], state => {
    return {
      ...state,
      loggingIn: true
    }
  })
  .cases([login.async.failed, register.async.failed], (state, { error }) => {
    return {
      ...state,
      loggingIn: false,
      error
    }
  })
  .cases(
    [login.async.done, register.async.done],
    (state, { params, result }) => {
      return {
        ...state,
        ...result.data,
        email: params.email,
        loggingIn: false,
        isLogin: true
      }
    }
  )
  .case(logout, () => {
    return {
      ...initialState
    }
  })
  .case(clearError, state => {
    delete state.error
    return {
      ...state
    }
  })
