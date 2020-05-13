import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { updateProfile } from '@/actions/userProfile'
import { connect } from 'react-redux'
import { renderFile, renderField, encode64 } from '@/util'
interface Props {
  updateProfile: any
  userProfile: any
  closeModal?: () => void
  update: () => void
}

class ProfileForm extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  {}
> {
  encodedImage!: string

  onSubmit: any = async (values: any) => {
    const { updateProfile, closeModal, update, userProfile } = this.props
    const encodedImage = await encode64(values.image_select)

    const res = await updateProfile({
      ...values,
      id: userProfile.user.id,
      image_select: encodedImage
    })
    if (res.status === 200) {
      closeModal!()
      if (update) update()
    }
  }

  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <p>プロフィール編集</p>
        <Field
          name="image_select"
          label="image_select"
          type="file"
          component={renderFile}
        ></Field>
        <Field
          name="user_bio"
          label="user_bio"
          type="text"
          component={renderField}
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

const mapDispatchToProps = { updateProfile }
const mapStateToProps = (state, ownProps) => ({
  initialValues: state.userProfile.user,
  userProfile: state.userProfile
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm<{}, Props>({
    validate,
    form: 'profileForm',
    enableReinitialize: true
  })(ProfileForm)
)
