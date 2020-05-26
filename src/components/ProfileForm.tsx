import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux'
import { renderFile, renderField, encode64 } from '@/utils/render'
import store from '@/store'
import { updateUser } from '@/actions/users'
interface Props {
  userProfile: any
  closeModal?: () => void
}

class ProfileForm extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  {}
> {
  onSubmit: any = async ({ image_select, user_bio }) => {
    const { closeModal, userProfile } = this.props
    const encodedImage = image_select ? await encode64(image_select) : null

    try {
      await store.dispatch(
        updateUser({
          id: userProfile.userId,
          user_bio,
          image_select: encodedImage
        })
      )
      closeModal!()
    } catch (e) {
      console.log(e, 'mock')
    }
  }

  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props
    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="form">
        <p className="form__title">プロフィール編集</p>
        <div className="form__input">
          <Field
            name="image_select"
            label="image_select"
            type="file"
            component={renderFile}
          ></Field>
        </div>
        <div className="form__input">
          <Field
            name="user_bio"
            label="user_bio"
            type="text"
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
  if (!values.comment) {
    errors.comment = 'コメントを入力してください'
  }
  return errors
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: state.userProfile.user,
  userProfile: state.userProfile
})

export default connect(
  mapStateToProps,
  null
)(
  reduxForm<{}, Props>({
    validate,
    form: 'profileForm',
    enableReinitialize: true
  })(ProfileForm)
)
