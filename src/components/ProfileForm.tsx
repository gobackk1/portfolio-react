import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { updateProfile } from '@/actions/userProfile'
import { connect } from 'react-redux'
import { renderFile, renderField } from '@/util'
interface Props {
  updateProfile: any
  userProfile: any
  closeModal?: () => void
}

class ProfileForm extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  {}
> {
  encodedImage!: string

  onSubmit: any = async (values: any) => {
    console.log(this.encodedImage)
    const res = await this.props.updateProfile({
      ...values,
      id: this.props.userProfile.user.id,
      image: this.encodedImage
    })
    if (res.status === 200) this.props.closeModal!()
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
