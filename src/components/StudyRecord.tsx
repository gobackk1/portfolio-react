import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import LikeCounter from '@/components/LikeCounter'
import Render from './Render'

interface Props extends RouteComponentProps {
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

  onClickCardRecord: ((id: number, any) => void) | null = (
    id,
    { nativeEvent }
  ) => {
    if (nativeEvent.target.tagName.toLowerCase() === 'button') return
    this.props.history.push(`/record/${id}`)
  }

  componentWillUnmount = () => {
    this.onClickCardRecord = null
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
    return (
      <div
        className="card-record"
        onClick={e => this.onClickCardRecord!(id, e)}
      >
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
            <div className="record__title-name">{user.name}</div>
            <div>{date}</div>
          </div>
          <div className="record__comment">{comment}</div>
          <dl className="record__list material-list">
            <dt>
              <i className="fas fa-book large"></i>教材:
            </dt>
            <dd>{teaching_material}</dd>
          </dl>
          <dl className="record__list material-list">
            <dt>
              <i className="far fa-clock large"></i>勉強時間:
            </dt>
            <dd>{study_hours}時間</dd>
          </dl>
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

export default withRouter(StudyRecord)
