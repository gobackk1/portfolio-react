import React from 'react'
import { Link } from 'react-router-dom'
import LikeCounter from '@/components/LikeCounter'
import Render from './Render'

interface Props {
  record: any
}

class StudyRecord extends React.Component<Props, {}> {
  renderIfRecordHasTag = study_genre_list => {
    if (!study_genre_list) return ''
    return study_genre_list.map((genre, index) => (
      <li key={index} className="tag-list__item tag">
        <div className="tag__body">{genre}</div>
      </li>
    ))
  }
  render() {
    const {
      id,
      record,
      record: {
        comment,
        teaching_material,
        study_hours,
        study_record_comments,
        study_genre_list
      },
      date,
      user
    } = this.props.record
    console.log(user)
    return (
      <div className="card-record">
        <div className="card-record__img">
          <img
            src={`${process.env.REACT_APP_API_URL}/images/user_images/${user.image_name}`}
            width="80"
            height="80"
            alt={user.name}
          />
        </div>
        <div className="card-record__body record">
          <div className="record__title">
            <div>{user.name}</div>
            <div>{date}</div>
          </div>
          <div className="record__comment">{comment}</div>
          <div className="record__material">
            教材: <br />
            {teaching_material}
          </div>
          <div className="record__hours">
            勉強時間: <br />
            {study_hours}時間
          </div>
          <div className="record__footer">
            <div className="record__tags">
              <ul className="tag-list">
                {this.renderIfRecordHasTag(study_genre_list)}
              </ul>
            </div>
            <div className="record__social">
              <div className="comment-counter">
                <i className="far fa-comment"></i>
                <span className="counter">
                  {study_record_comments ? study_record_comments.length : 0}
                </span>
              </div>
              {/* <Link to={`/record/${id}`}></Link> */}
              <div>
                <LikeCounter record={record}></LikeCounter>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default StudyRecord
