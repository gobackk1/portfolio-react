import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux'
import store from '@/store'
import { postTeachingMaterial } from '@/actions/teachingMaterials'
import {
  renderTextarea,
  renderErrorMessages,
  renderFile,
  renderField,
  encode64
} from '@/util'
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
    const { image_select } = values
    const encodedImage = image_select
      ? await encode64(values.image_select)
      : null
    const res = await store.dispatch(
      postTeachingMaterial({
        ...values,
        user_id: id,
        image_select: encodedImage
      })
    )
    if (res.status === 200) closeModal!()
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
            component={renderField}
          ></Field>
        </div>
        <div className="form__input">
          <Field
            name="image_select"
            label="画像を選んでください"
            type="file"
            component={renderFile}
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
