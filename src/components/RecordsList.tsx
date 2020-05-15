import React from 'react'
import StudyRecord from '@/components/StudyRecord'
import _ from 'lodash'
import { connect } from 'react-redux'

interface Props {
  studyRecords?: any
}

class RecordsList extends React.Component<Props> {
  render() {
    return (
      <>
        <ul className="record-list">
          {this.props.studyRecords.records.map((record, index) => (
            <li key={index} className="record-list__item">
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

export default connect(mapStateToProps, null)(RecordsList)
