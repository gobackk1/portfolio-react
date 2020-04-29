export default interface UserState {
  id: number
  name: string
  email: string
  created_at: string
  token: string
  error: null | {}
  loggingIn: boolean
  isLogin: boolean
}
