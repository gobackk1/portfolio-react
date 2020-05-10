import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux'
import store from '@/store'
import { postTeachingMaterial } from '@/actions/teachingMaterials'
import { withRouter } from 'react-router'

interface Props {
  user?: any
  closeModal?: () => void
}

class RecordForm extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  {}
> {
  onSubmit = async (values: any) => {
    const {
      user: { id },
      closeModal
    } = this.props
    const res = await store.dispatch(
      postTeachingMaterial({ ...values, userId: id })
    )
    if (res.status === 200) closeModal!()
  }

  renderTextarea = field => {
    const {
      input,
      label,
      type,
      meta: { touched, error }
    } = field

    return (
      <div className="form__input">
        <textarea
          {...input}
          cols="20"
          rows="10"
          placeholder={label}
          className="textarea"
        ></textarea>
        <div className="error-msg">{touched && error}</div>
      </div>
    )
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
          {...input}
          placeholder={label}
          type={type}
          className="input"
        ></input>
        <div className="error-msg">{touched && error}</div>
      </>
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

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="form--record">
        <p className="form__title">教材を登録する</p>
        <div className="form__input">
          教材名<span className="caution">*</span>
          <Field
            label="教材名を入力してください"
            name="title"
            type="text"
            component={this.renderField}
          ></Field>
        </div>
        <button
          disabled={pristine || submitting || invalid}
          className="button-submit"
        >
          登録
        </button>
      </form>
    )
  }
}

const validate = (values: any) => {
  if (!values) return
  const errors: any = {}
  // if (values.comment) {
  //   if (values.comment.length > 100) {
  //     errors.comment = 'コメントは100字以内にしてください'
  //   }
  // }
  // if (!values.teaching_material) {
  //   errors.teaching_material = '教材は必須です'
  // }
  // if (!values.study_hours) {
  //   errors.study_hours = '勉強時間は必須です'
  // }
  return errors
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  null
)(
  reduxForm<{}, Props>({
    form: 'recordForm',
    validate
  })(RecordForm)
)
