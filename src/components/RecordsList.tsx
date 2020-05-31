import React from 'react'
import StudyRecord from '@/components/StudyRecord'
import DotSpinner from '@/components/DotSpinner'
import _ from 'lodash'
import { connect } from 'react-redux'
import { Waypoint } from 'react-waypoint'

interface Props {
  studyRecords?: any
  userProfile?: any
  page?: 'profile'
  records: any
}

class RecordsList extends React.Component<Props, {}> {
  render() {
    let onLoadStudyRecords
    if (this.props.page === 'profile') {
      onLoadStudyRecords = this.props.userProfile.onLoadStudyRecords
    } else {
      onLoadStudyRecords = this.props.studyRecords.onLoadStudyRecords
    }
    const { isLoading } = this.props.studyRecords
    return (
      <>
        <ul className="record-list">
          {this.props.records.map((record, index) => (
            <li key={index} className="record-list__item">
              <StudyRecord record={record}></StudyRecord>
            </li>
          ))}
          {!this.props.records.length && (
            <li className="not-found tac">勉強記録が見つかりませんでした</li>
          )}
        </ul>
        <Waypoint onEnter={onLoadStudyRecords} bottomOffset="-400px"></Waypoint>
        {isLoading && (
          <div className="tac">
            <DotSpinner></DotSpinner>
          </div>
        )}
      </>
    )
  }
}

const mapStateToProps = state => ({
  studyRecords: state.studyRecords,
  userProfile: state.userProfile
})

export default connect(mapStateToProps, null)(RecordsList)
