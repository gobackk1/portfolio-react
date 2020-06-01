import React from 'react'
import StudyRecord from '@/components/StudyRecord'
import { Waypoint } from 'react-waypoint'
import LoadSpinner from '@/components/LoadSpinner'

interface Props {
  state: any
}

export const RecordsList: React.SFC<Props> = ({ state }) => {
  const { isLoading, records, onLoadStudyRecords } = state
  return (
    <>
      <ul className="record-list">
        {records.map((record, index) => (
          <li key={index} className="record-list__item">
            <StudyRecord record={record}></StudyRecord>
          </li>
        ))}
      </ul>
      <Waypoint onEnter={onLoadStudyRecords} bottomOffset="-400px"></Waypoint>
      <LoadSpinner active={isLoading}></LoadSpinner>
    </>
  )
}

export default RecordsList
