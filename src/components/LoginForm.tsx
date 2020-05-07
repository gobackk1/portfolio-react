import React from 'react'
import { Field, FormSection, reduxForm, InjectedFormProps } from 'redux-form'
import { login, register, clearError } from '@/actions/user'
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
    store.dispatch(clearError())
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
      <FormSection name="register" className="form__section">
        ユーザー名
        <Field
          label="半角英数字6文字以上"
          name="name"
          type="text"
          component={this.renderField}
        ></Field>
        メール
        <Field
          label="例/ example@example.com"
          name="email"
          type="text"
          component={this.renderField}
        ></Field>
        パスワード
        <Field
          label="半角英数字6文字以上"
          name="password"
          type="password"
          component={this.renderField}
        ></Field>
      </FormSection>
    )
  }

  renderErrorMessages = error => {
    if (!error) return
    return error.response.data.messages.map((msg, index) => {
      return (
        <p className="error-msg" key={index}>
          *{msg}
        </p>
      )
    })
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      reset,
      user: { error }
    } = this.props
    // console.log(this.props)

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="form">
        <p className="form__title">
          {this.state.isLoginForm ? 'ログイン' : '新規登録'}
        </p>
        {this.renderErrorMessages(error)}
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
            onClick={() => {
              this.toggleForm()
              reset()
            }}
            className="button-login-or-register"
          >
            {this.state.isLoginForm ? '新規登録へ' : 'ログインへ'}
          </button>
        </div>
      </form>
    )
  }
}

const validate = (values: any) => {
  const errors: any = {
    login: {},
    register: {}
  }

  if (values.login) {
    if (!values.login.email) {
      errors.login.email = 'メールアドレスが未入力です'
    }
    if (!values.login.password) {
      errors.login.password = 'パスワードを入力してください'
    } else if (values.login.password.length < 6) {
      errors.login.password = 'パスワードは6文字以上で入力してください'
    }
  }

  if (values.register) {
    if (!values.register.email) {
      errors.register.email = 'メールアドレスが未入力です'
    }
    if (!values.register.name) {
      errors.register.name = 'ユーザー名を入力してください'
    } else if (values.register.name.length < 6) {
      errors.register.name = 'ユーザー名は6文字以上で入力してください'
    }
    if (!values.register.password) {
      errors.register.password = 'パスワードを入力してください'
    } else if (values.register.password.length < 6) {
      errors.register.password = 'パスワードは6文字以上で入力してください'
    }
  }

  return errors
}

const initialValues = {
  login: {
    email: '',
    password: ''
  },
  logout: {
    name: '',
    password: '',
    email: ''
  }
}

const mapStateToProps = state => ({ user: state.user, initialValues })

export default connect(
  mapStateToProps,
  null
)(
  reduxForm<{}, Props>({
    initialValues,
    validate,
    form: 'loginForm'
  })(LoginForm)
)
