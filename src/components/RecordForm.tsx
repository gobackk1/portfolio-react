import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux'
import store from '@/store'
import { postStudyRecord, putStudyRecord } from '@/actions/studyRecords'
import { withRouter } from 'react-router'

interface Props {
  user?: any
  closeModal?: () => void
  type: 'post' | 'edit'
}

class RecordForm extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  {}
> {
  formTitle!: string
  onSubmit!: (value: any) => Promise<any>

  constructor(props) {
    super(props)
    const { type } = this.props

    this.formTitle = type === 'post' ? '記録' : '編集'
    this.onSubmit =
      type === 'post'
        ? this.dispatchPostStudyRecord
        : this.dispatchUpdateStudyRecord
  }

  private dispatchPostStudyRecord = async values => {
    const res = await store.dispatch(postStudyRecord(values))
    if (res.status === 200) this.props.closeModal!()
  }

  private dispatchUpdateStudyRecord = async values => {
    const res = await store.dispatch(putStudyRecord(values))
    if (res.status === 200) this.props.closeModal!()
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
        <p className="form__title">{this.formTitle}</p>

        <div className="form__input">
          教材<span className="caution">*</span>
          <Field
            label="何を利用して学びましたか？"
            name="teaching_material"
            type="text"
            component={this.renderField}
          ></Field>
        </div>
        <div className="form__input">
          勉強時間<span className="caution">*</span>
          <Field
            label=""
            name="study_hours"
            type="number"
            component={this.renderField}
          ></Field>
        </div>
        <div className="form__input">
          コメント
          <Field
            label="勉強内容をコメントしよう。（100字以内）"
            name="comment"
            text="text"
            component={this.renderTextarea}
          ></Field>
        </div>
        <div className="form__input">
          タグ
          <br />
          <Field
            label="例/ プログラミング,PHP"
            name="study_genre_list"
            type="text"
            component={this.renderField}
          ></Field>
          <small></small>
        </div>
        <ul className="form__notice font-sm">
          <li>タグは半角コンマ(,)で区切ってください。</li>
          <li>
            <span className="caution">*</span>は必須です
          </li>
        </ul>
        <button
          disabled={pristine || submitting || invalid}
          className="button-submit"
        >
          記録する
        </button>
      </form>
    )
  }
}

const validate = (values: any) => {
  if (!values) return
  const errors: any = {}
  if (values.comment) {
    if (values.comment.length > 100) {
      errors.comment = 'コメントは100字以内にしてください'
    }
  }
  if (!values.teaching_material) {
    errors.teaching_material = '教材は必須です'
  }
  if (!values.study_hours) {
    errors.study_hours = '勉強時間は必須です'
  }
  return errors
}

const mapStateToProps = (state, props) => {
  if (!(props.type === 'edit')) {
    return {
      user: state.user
    }
  }

  const { records } = state.studyRecords
  const id = Number(props.match.params.id)
  const index = records.findIndex(r => r.id === id)
  const studyRecord = records[index]

  return {
    user: state.user,
    initialValues: studyRecord.record
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(
    reduxForm<{}, Props>({
      form: 'recordForm',
      validate
    })(RecordForm)
  )
)
