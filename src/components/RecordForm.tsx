import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux'
import store from '@/store'
import { postStudyRecord, putStudyRecord } from '@/actions/studyRecords'
import { withRouter } from 'react-router'
import {
  renderField,
  renderTextarea,
  renderFile,
  encode64
} from '@/utils/render'
import MaterialImage from '@/components/MaterialImage'

interface Props {
  user?: any
  closeModal?: () => void
  type: 'post' | 'edit'
  material?: any
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
    const { material } = this.props
    const { image_select } = values
    const teaching_material_name = material
      ? material.title
      : values.teaching_material_name
    const image_url = material ? material.image_url : null
    const encodedImage = image_select ? await encode64(image_select) : null

    const res = await store.dispatch(
      postStudyRecord({
        ...values,
        teaching_material_name,
        image_url,
        image_select: encodedImage
      })
    )

    if (res.status === 200) this.props.closeModal!()
  }

  private dispatchUpdateStudyRecord = async values => {
    const { image_select } = values
    const encodedImage = image_select ? await encode64(image_select) : null

    const res = await store.dispatch(
      putStudyRecord({ ...values, image_select: encodedImage })
    )

    if (res.status === 200) this.props.closeModal!()
  }

  renderMaterial = () => {
    const { material } = this.props

    if (material) {
      return (
        <>
          教材
          <div>{material.title}</div>
          <MaterialImage
            bgUrl={`url(${process.env.REACT_APP_API_URL}${material.image_url}) no-repeat center/contain`}
            height={100}
          ></MaterialImage>
        </>
      )
    }
    return (
      <div className="form__input">
        教材<span className="caution">*</span>
        <Field
          label="何を利用して学びましたか？"
          name="teaching_material_name"
          type="text"
          component={renderField}
        ></Field>
      </div>
    )
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      material,
      reset,
      user: { error }
    } = this.props

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="form--record">
        <p className="form__title">{this.formTitle}</p>

        {this.renderMaterial()}
        <div className="form__input">
          勉強時間<span className="caution">*</span>
          <Field
            label=""
            name="study_hours"
            type="number"
            component={renderField}
          ></Field>
        </div>
        <div className="form__input">
          コメント
          <Field
            label="勉強内容をコメントしよう。（100字以内）"
            name="comment"
            text="text"
            component={renderTextarea}
          ></Field>
        </div>
        {!material && (
          <div className="form__input">
            画像
            <Field
              name="image_select"
              label="画像を選んでください"
              type="file"
              component={renderFile}
            ></Field>
          </div>
        )}
        <div className="form__input">
          タグ
          <br />
          <Field
            label="例/ プログラミング,PHP"
            name="study_genre_list"
            type="text"
            component={renderField}
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
  if (!values.teaching_material_name) {
    errors.teaching_material_name = '教材は必須です'
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
