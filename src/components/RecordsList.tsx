import React from 'react'
import StudyRecord from '@/components/StudyRecord'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Waypoint } from 'react-waypoint'

interface Props {
  studyRecords?: any
}

class RecordsList extends React.Component<Props> {
  render() {
    const { onLoadStudyRecords, isLoading } = this.props.studyRecords
    return (
      <>
        <ul className="record-list">
          {this.props.studyRecords.records.map((record, index) => (
            <li key={index} className="record-list__item">
              <StudyRecord record={record}></StudyRecord>
            </li>
          ))}
        </ul>
        <Waypoint onEnter={onLoadStudyRecords} bottomOffset="-400px"></Waypoint>
        {isLoading && '読み込み中MOCK'}
      </>
    )
  }
}

const mapStateToProps = state => ({
  studyRecords: state.studyRecords
})

export default connect(mapStateToProps, null)(RecordsList)
