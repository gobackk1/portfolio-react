import React from 'react'
import StudyRecord from '@/components/StudyRecord'
import _ from 'lodash'
import { connect } from 'react-redux'
import { readStudyRecords } from '@/actions/studyRecords'

interface Props {
  studyRecords: any
  readStudyRecords: any
}

class RecordsList extends React.Component<Props> {
  componentDidMount() {
    this.props.readStudyRecords()
  }
  render() {
    return (
      <>
        <h3>記録一覧</h3>
        <ul>
          {_.map(this.props.studyRecords, (record, index) => (
            <li key={index}>
              <StudyRecord record={record}></StudyRecord>
            </li>
          ))}
        </ul>
      </>
    )
  }
}

const mapStateToProps = state => ({
  studyRecords: state.studyRecords
})

const mapDispatchToProps = { readStudyRecords }

export default connect(mapStateToProps, mapDispatchToProps)(RecordsList)
