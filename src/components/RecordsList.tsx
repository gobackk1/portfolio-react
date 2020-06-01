import React from 'react'
import StudyRecord from '@/components/StudyRecord'
import { Waypoint } from 'react-waypoint'

interface Props {
  data: any
  onLoadStudyRecords: any
}

export const RecordsList: React.SFC<Props> = props => {
  const { data, onLoadStudyRecords } = props
  return (
    <>
      <ul className="record-list">
        {data.map((record, index) => (
          <li key={index} className="record-list__item">
            <StudyRecord record={record}></StudyRecord>
          </li>
        ))}
      </ul>
      <Waypoint onEnter={onLoadStudyRecords} bottomOffset="-400px"></Waypoint>
    </>
  )
}

export default RecordsList
