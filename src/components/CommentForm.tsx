import React from 'react'
import { Field, FormSection, reduxForm, InjectedFormProps } from 'redux-form'
import { postComment } from '@/actions/studyRecords'
import { AuthReqParams } from '@/interfaces/AuthReqParams'
import { connect } from 'react-redux'

interface Props {
  postComment: any
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
    this.props.postComment({ ...values })
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
        <textarea placeholder={label} type={type} {...input} />
        <div>{touched && error}</div>
      </>
    )
  }

  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <p>コメントする</p>
        <Field
          type="text"
          name="comment"
          label="comment"
          component={this.renderField}
        ></Field>
        <button disabled={pristine || submitting || invalid}>送信</button>
      </form>
    )
  }
}

const validate = (values: any) => {
  const errors: any = {}
  if (!values.comment) {
    errors.comment = 'コメントを入力してください'
  }
  return errors
}

const mapDispatchToProps = { postComment }

export default connect(
  null,
  mapDispatchToProps
)(
  reduxForm<{}, Props>({
    validate,
    form: 'commentForm',
    enableReinitialize: true
  })(LoginForm)
)
