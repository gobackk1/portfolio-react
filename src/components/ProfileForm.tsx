import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { updateProfile } from '@/actions/userProfile'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

interface Props {
  updateProfile: any
  userProfile: any
}

class ProfileForm extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  {}
> {
  encodedImage!: string

  onSubmit: any = async (values: any) => {
    console.log(values, 'values')

    await this.props.updateProfile({
      ...values,
      id: this.props.userProfile.user.id,
      image: this.encodedImage
    })

    const overlay = document.querySelector('.ReactModal__Overlay')
    if (overlay) (overlay as HTMLElement).click()
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
        <input placeholder={label} type={type} {...input} />
        <div>{touched && error}</div>
      </>
    )
  }
  renderFile = field => {
    let {
      input: { value, name, onChange },
      label,
      type,
      onFieldChange,
      meta: { touched, error }
    } = field

    return (
      <>
        <input
          placeholder={label}
          type="file"
          onChange={e => {
            e.preventDefault()
            if (!e.target.files) return
            const reader = new FileReader()
            reader.onloadend = () => {
              if (!reader.result) return
              const result = reader.result as string
              const base64 = result.slice(result.indexOf(',') + 1)
              this.encodedImage = base64
            }
            reader.readAsDataURL(e.target.files[0])

            onChange(e.target.files[0])
            onFieldChange && onFieldChange(e.target.files[0])
          }}
        />
        <div>{touched && error}</div>
      </>
    )
  }

  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <p>プロフィール編集</p>
        {/* <input type="file" /> */}
        <Field
          name="image_select"
          label="image_select"
          type="file"
          component={this.renderFile}
        ></Field>
        <Field
          name="user_bio"
          label="user_bio"
          type="text"
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
