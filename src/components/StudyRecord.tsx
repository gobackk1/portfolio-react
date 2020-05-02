import React from 'react'
import { Link } from 'react-router-dom'
import LikeCounter from '@/components/LikeCounter'

interface Props {
  record: any
}

class StudyRecord extends React.Component<Props, {}> {
  renderIfRecordHasTag = record => {
    if (!record.study_genre_list) return ''
    return record.study_genre_list.map((genre, index) => (
      <li key={index}>{genre}</li>
    ))
  }
  render() {
    const {
      id,
      user_id,
      comment,
      teaching_material,
      study_hours,
      study_record_comments
    } = this.props.record
    return (
      <div>
        <Link to={`/record/${id}`}>記録詳細ページへ</Link>
        <div>{user_id}</div>
        <div>{comment}</div>
        <div>{teaching_material}</div>
        <div>{study_hours}</div>
        <div>
          コメント数：
          {study_record_comments ? study_record_comments.length : 0}
        </div>
        <div>
          <LikeCounter record={this.props.record}></LikeCounter>
        </div>
        <h3>tags</h3>
        <ul>{this.renderIfRecordHasTag(this.props.record)}</ul>
      </div>
    )
  }
}

export default StudyRecord
