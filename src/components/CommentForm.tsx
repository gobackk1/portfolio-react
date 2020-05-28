import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { postComment } from '@/actions/studyRecords'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { renderField } from '@/utils/render'

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
    try {
      await this.props.postComment({
        ...values,
        study_record_id: this.props.recordId
      })
      this.props.closeModal!()
    } catch (e) {
      console.log(e, 'コメントが正しく送信できませんでしたmock')
    }
  }

  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props
    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="form--comment">
        <p className="form__title">コメントする</p>
        <div className="form__input">
          <Field
            type="text"
            name="comment_body"
            label="コメントを返信する。（100字以内）"
            component={renderField}
          ></Field>
        </div>
        <button
          disabled={pristine || submitting || invalid}
          className="button-submit"
        >
          送信
        </button>
      </form>
    )
  }
}

const validate = (values: any) => {
  const errors: any = {}
  if (!values.comment_body) {
    errors.comment_body = 'コメントを入力してください'
  }
  if (values.comment_body) {
    if (values.comment_body.length > 100) {
      errors.comment_body = 'コメントは100字以内にしてください'
    }
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
