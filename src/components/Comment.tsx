import React from 'react'
import { connect } from 'react-redux'
import store from '@/store'
import { deleteComment } from '@/actions/studyRecords'

interface Props {
  data: any
  user?: any
  recordId: number
}

class Comment extends React.Component<Props> {
  deleteComment = (id: number) => {
    if (!window.confirm('本当にコメントを削除しますか？')) return
    store.dispatch(deleteComment({ id, study_record_id: this.props.recordId }))
  }

  render() {
    const {
      data: { date, user, comment_body, id }
    } = this.props
    const correctUser = user.id === this.props.user.id
    return (
      <div className="card-user">
        <div className="card-user__profile">
          <div className="card-user__profile-head">
            <img
              src={`${process.env.REACT_APP_API_URL}${user.image_url}`}
              width="80"
              height="80"
              alt={user.name}
            />
          </div>
          <div className="card-user__profile-body">
            <div className="card-user__profile-name">{user.name}</div>
            {comment_body}
          </div>
        </div>
        <div className="card-user__tail">
          <div className="card-user__tail-date">{date}</div>
          <div className="card-user__tail-button">
            {correctUser && (
              <button onClick={() => this.deleteComment(id)}>削除</button>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps, null)(Comment)
