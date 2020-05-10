import React from 'react'
import { connect } from 'react-redux'
import { putStudyRecord, deleteStudyRecord } from '@/actions/studyRecords'
import { Link, RouteComponentProps } from 'react-router-dom'
import { reduxForm, Field, InjectedFormProps } from 'redux-form'

interface Props extends RouteComponentProps<{ id: string }> {
  studyRecords: any
  putStudyRecord: any
  deleteStudyRecord: any
}

class UserShow extends React.Component<
  Props & InjectedFormProps<{}, Props>,
  {}
> {
  state = {
    record: {
      id: 0,
      user_id: 0,
      comment: '',
      teaching_material: '',
      study_hours: 0
    }
  }

  renderFiled = field => {
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

  onSubmit = async (values: any) => {
    await this.props.putStudyRecord({ ...values })
    this.props.history.push(`/record/${values.id}`)
  }

  onClickDelete = async () => {
    await this.props.deleteStudyRecord(this.props.match.params.id)
    this.props.history.push('/record')
  }

  render() {
    const { handleSubmit, pristine, submitting, invalid } = this.props
    return (
      <>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            label="user_id"
            name="user_id"
            type="hidden"
            component={this.renderFiled}
          ></Field>
          <Field
            label="comment"
            name="comment"
            type="text"
            component={this.renderFiled}
          ></Field>
          <Field
            label="teaching_material"
            name="teaching_material"
            type="text"
            component={this.renderFiled}
          ></Field>
          <Field
            label="study_hours"
            name="study_hours"
            type="number"
            component={this.renderFiled}
          ></Field>
          <button disabled={pristine || submitting || invalid}>送信</button>
          <button type="button" onClick={this.onClickDelete}>
            削除
          </button>
        </form>
      </>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => {
  console.log(ownProps)

  const studyRecord = state.studyRecords[ownProps.match.params.id]
  return {
    initialValues: studyRecord,
    studyRecord
  }
}
const mapDispatchToProps = { putStudyRecord, deleteStudyRecord }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm<{}, Props>({ form: 'recordEditForm' })(UserShow)
)
