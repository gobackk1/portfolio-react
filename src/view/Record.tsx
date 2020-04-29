import React from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux'
import { readStudyRecords, postStudyRecord } from '@/actions'
import _ from 'lodash'
import { Link } from 'react-router-dom'

interface Props {
  readStudyRecords: any
  postStudyRecord: any
  studyRecords: any
}

class Record extends React.Component<Props & InjectedFormProps<{}, Props>, {}> {
  componentDidMount() {
    this.fetchData()
  }
  async fetchData() {
    await this.props.readStudyRecords()
    console.log('fetched records')
  }
  renderTextarea = field => {
    const {
      input,
      label,
      type,
      meta: { touched, error }
    } = field

    return (
      <>
        <textarea {...input} cols="30" rows="10" placeholder={label}></textarea>
        <div>{touched && error}</div>
      </>
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
        <input {...input} placeholder={label} type={type}></input>
        <div>{touched && error}</div>
      </>
    )
  }
  onSubmit = (values: any) => {
    this.props.postStudyRecord({ ...values })
  }
  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props
    return (
      <>
        <ul>
          {_.map(this.props.studyRecords, record => (
            <li key={record.id}>
              <Link to={`/record/${record.id}`}>記録詳細ページへ</Link>
              <div>{record.user_id}</div>
              <div>{record.comment}</div>
              <div>{record.teaching_material}</div>
              <div>{record.study_hours}</div>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            label="comment"
            name="comment"
            text="text"
            component={this.renderTextarea}
          ></Field>
          <Field
            label="teaching_material"
            name="teaching_material"
            type="text"
            component={this.renderField}
          ></Field>
          <Field
            label="study_hours"
            name="study_hours"
            type="number"
            component={this.renderField}
          ></Field>
          <button disabled={pristine || submitting || invalid}>送信</button>
        </form>
      </>
    )
  }
}

const validate = (value: any) => {
  const errors: any = {}
  return errors
}

const mapStateToProps = state => ({ studyRecords: state.studyRecords })
const mapDispatchToProps = { readStudyRecords, postStudyRecord }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm<{}, Props>({ validate, form: 'studyRecordForm' })(Record)
)
