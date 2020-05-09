import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { postComment } from '@/actions/studyRecords'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

interface Props {
  recordId: number
  postComment: any
  closeModal?: () => void
}

class CommentForm extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  {}
> {
  onSubmit: any = async (values: any) => {
    const res = await this.props.postComment({
      ...values,
      study_record_id: this.props.recordId
    })
    if (res.status === 200) this.props.closeModal!()
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
          name="comment_body"
          label="comment_body"
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
    form: 'commentForm'
  })(CommentForm)
)
