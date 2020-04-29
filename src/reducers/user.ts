import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { login, register, logout } from '@/actions'
import ServerResponse from '@/interfaces/ServerResponse'
import UserState from '@/interfaces/UserState'
import { AuthReqParams } from '@/interfaces/AuthReqParams'

type AuthDoneParams = {
  params: AuthReqParams
  result: ServerResponse
}

const initialState: UserState = {
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
    console.log(state, 'started')
    return {
      ...state,
      loggingIn: true
    }
  })
  .cases([login.async.failed, register.async.failed], (state, error) => {
    console.log(error, 'failed')
    return {
      ...state,
      loggingIn: false,
      error
    }
  })
  .cases(
    [login.async.done, register.async.done],
    (state, { params, result }: AuthDoneParams) => {
      console.log(result, 'done')
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
