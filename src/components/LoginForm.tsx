import React from 'react'
import { Field, FormSection, reduxForm, InjectedFormProps } from 'redux-form'
import { login, register } from '@/actions/user'
import { AuthReqParams } from '@/interfaces/AuthReqParams'
import { connect } from 'react-redux'
import store from '@/store'

interface Props {
  user?: any
}
interface State {
  isLoginForm: boolean
}
interface FormValue {
  [key: string]: AuthReqParams
}

class LoginForm extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  State
> {
  state: State = {
    isLoginForm: true
  }
  onSubmit: any = (values: FormValue) => {
    this.state.isLoginForm
      ? store.dispatch(login({ ...values.login }))
      : store.dispatch(register({ ...values.register }))
  }

  toggleForm = () => {
    this.setState({ isLoginForm: !this.state.isLoginForm })
  }

  renderField = field => {
    const {
      input,
      label,
      type,
      meta: { touched, error }
    } = field

    return (
      <div className="form__input">
        <input placeholder={label} type={type} {...input} className="input" />
        <div className="error-msg">{touched && error}</div>
      </div>
    )
  }

  renderIfLoginForm = () => {
    if (!this.state.isLoginForm) return
    return (
      <FormSection name="login" className="form__section">
        メール
        <Field
          label="例/ example@example.com"
          name="email"
          type="text"
          component={this.renderField}
        ></Field>
        パスワード
        <Field
          label="パスワードを入力してください"
          name="password"
          type="password"
          component={this.renderField}
        ></Field>
      </FormSection>
    )
  }
  renderIfRegisterForm = () => {
    if (this.state.isLoginForm) return
    return (
      <FormSection name="register">
        <Field
          label="name"
          name="name"
          type="password"
          component={this.renderField}
        ></Field>
        <Field
          label="email"
          name="email"
          type="text"
          component={this.renderField}
        ></Field>
        <Field
          label="password"
          name="password"
          type="password"
          component={this.renderField}
        ></Field>
      </FormSection>
    )
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      user: { error }
    } = this.props

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="form">
        <p className="form__title">
          {this.state.isLoginForm ? 'ログイン' : '新規登録'}
        </p>
        {error && <p className="error-msg">{error.response.data.message}</p>}
        {this.renderIfLoginForm()}
        {this.renderIfRegisterForm()}
        <div className="form__buttons">
          <button
            disabled={pristine || submitting || invalid}
            className="button-submit"
          >
            送信
          </button>
          <button
            type="button"
            onClick={this.toggleForm}
            className="button-login-or-register"
          >
            {this.state.isLoginForm ? '新規登録' : 'ログイン'}
          </button>
        </div>
      </form>
    )
  }
}

const validate = (values: any) => {
  if (!values.login) return
  const errors: any = {
    login: {},
    register: {}
  }

  if (!values.login.email) {
    errors.login.email = 'メールアドレスが未入力です'
  }
  if (!values.login.password) {
    errors.login.password = 'パスワードを入力してください'
  } else if (values.login.password.length < 6) {
    errors.login.password = 'パスワードは6文字以上で入力してください'
  }

  return errors
}

const mapStateToProps = state => ({ user: state.user })

export default connect(
  mapStateToProps,
  null
)(
  reduxForm<{}, Props>({
    validate,
    form: 'loginForm'
  })(LoginForm)
)
