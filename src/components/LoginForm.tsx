import React from 'react'
import { Field, FormSection, reduxForm, InjectedFormProps } from 'redux-form'
import { login, register } from '@/actions/user'
import { AuthReqParams } from '@/interfaces/AuthReqParams'
import { connect } from 'react-redux'

interface Props {
  login: any
  register: any
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
      ? this.props.login({ ...values.login })
      : this.props.register({ ...values.register })
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
      <>
        <input
          placeholder={label}
          type={type}
          // errorText={touched && error}
          {...input}
        />
        <div>{touched && error}</div>
      </>
    )
  }

  renderIfLoginForm = () => {
    if (!this.state.isLoginForm) return
    return (
      <FormSection name="login">
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
    const { handleSubmit, pristine, submitting, invalid } = this.props
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <p>{this.state.isLoginForm ? 'ログイン' : '新規登録'}</p>
        {this.renderIfLoginForm()}
        {this.renderIfRegisterForm()}
        <button disabled={pristine || submitting || invalid}>送信</button>
        <button type="button" onClick={this.toggleForm}>
          {this.state.isLoginForm ? '新規登録' : 'ログイン'}
        </button>
      </form>
    )
  }
}

const validate = (values: any) => {
  const errors: any = {}
  console.log('validates')

  if (!values.email) {
    errors.email = 'メールアドレスを入力してください'
  } else {
    if (values.email.length <= 6) errors.email = 'メールアドレスが短すぎます'
  }
  if (!values.password) errors.password = 'パスワードを入力してください'
  if (!values.name) errors.name = 'ユーザー名を入力してください'
  console.log(errors)

  return errors
}

const mapDispatchToProps = { login, register }

export default connect(
  null,
  mapDispatchToProps
)(
  reduxForm<{}, Props>({
    validate,
    form: 'loginForm',
    enableReinitialize: true
  })(LoginForm)
)
