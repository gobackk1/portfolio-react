import React from 'react'
import { Field, FormSection, reduxForm, InjectedFormProps } from 'redux-form'
import { login, register, clearError } from '@/actions/user'
import { connect } from 'react-redux'
import store from '@/store'
import Render from '@/components/Render'
import { renderField, renderErrorMessages } from '@/utils/render'

interface Props {
  user?: any
  closeModal?: () => void
}
interface State {
  isLoginForm: boolean
}

class LoginForm extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  State
> {
  state: State = {
    isLoginForm: true
  }

  onSubmit: any = async (values: any) => {
    this.state.isLoginForm
      ? await store.dispatch(login(values.login))
      : await store.dispatch(register(values.register))
    // XXX: LoginFormだけ、ログイン成功時に閉じるが、理由がわからない
    // if (res.status === 200) {
    //   this.props.closeModal!()
    // }
  }

  toggleForm = () => {
    this.setState({ isLoginForm: !this.state.isLoginForm })
    store.dispatch(clearError())
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

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="form--login">
        <p className="form__title">
          {this.state.isLoginForm ? 'ログイン' : '新規登録'}
        </p>
        {error && renderErrorMessages(error.response.data.messages)}
        <Render if={this.state.isLoginForm}>
          <FormSection name="login" className="form__section">
            <div className="form__input">
              メール
              <Field
                label="例/ example@example.com"
                name="email"
                type="text"
                component={renderField}
              ></Field>
            </div>
            <div className="form__input">
              パスワード
              <Field
                label="パスワードを入力してください"
                name="password"
                type="password"
                component={renderField}
              ></Field>
            </div>
          </FormSection>
        </Render>
        <Render if={!this.state.isLoginForm}>
          <FormSection name="register" className="form__section">
            <div className="form__input">
              ユーザー名
              <Field
                label="半角英数字6文字以上"
                name="name"
                type="text"
                component={renderField}
              ></Field>
            </div>
            <div className="form__input">
              メール
              <Field
                label="例/ example@example.com"
                name="email"
                type="text"
                component={renderField}
              ></Field>
            </div>
            <div className="form__input">
              パスワード
              <Field
                label="半角英数字6文字以上"
                name="password"
                type="password"
                component={renderField}
              ></Field>
            </div>
          </FormSection>
        </Render>
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
