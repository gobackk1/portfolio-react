import React from 'react'
import { connect } from 'react-redux'
import {
  getStudyRecord,
  readStudyRecords,
  deleteComment
} from '@/actions/studyRecords'
import { Link, Switch, Route, RouteComponentProps } from 'react-router-dom'
import Modal from '@/components/Modal'
import CommentForm from '@/components/CommentForm'
import IfCorrectUser from '@/components/IfCorrectUser'

interface Props extends RouteComponentProps<{ id: string }> {
  getStudyRecord: any
  readStudyRecords: any
  studyRecords: any
  deleteComment: any
  user: any
}

class UserShow extends React.Component<Props, {}> {
  id: string = '1'

  async fetchData(): Promise<void> {
    try {
      await this.props.getStudyRecord(this.id)
    } catch (e) {
      console.log(e)
      this.props.history.push('/')
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  deleteComment = (id: number) => {
    this.props.deleteComment({ id, study_record_id: this.id })
  }

  render() {
    this.id = this.props.match.params.id

    try {
      return (
        <>
          <h3>Record detail</h3>
          <ul>
            <li>{this.props.studyRecords[this.id].id}</li>
            <li>{this.props.studyRecords[this.id].user_id}</li>
            <li>{this.props.studyRecords[this.id].comment}</li>
            <li>{this.props.studyRecords[this.id].teaching_material}</li>
            <li>{this.props.studyRecords[this.id].study_hours}</li>
          </ul>
          <h4>comment</h4>
          <ul>
            {this.props.studyRecords[this.id].study_record_comments.map(
              (comment, index) => (
                <li key={index}>
                  {comment.comment_body}
                  <IfCorrectUser userId={comment.user_id}>
                    <button onClick={() => this.deleteComment(comment.id)}>
                      削除
                    </button>
                  </IfCorrectUser>
                </li>
              )
            )}
          </ul>
          <Link to="/record">戻る</Link>
          <Link to={`/record/${this.id}/edit`}>編集</Link>
          <Modal content={<CommentForm recordId={this.id}></CommentForm>}>
            コメント
          </Modal>
        </>
      )
    } catch (e) {
      this.props.history.push('/')
      return <div></div>
    }
  }
}

const mapStateToProps = state => ({
  studyRecords: state.studyRecords,
  user: state.user
})
const mapDispatchToProps = { getStudyRecord, readStudyRecords, deleteComment }

export default connect(mapStateToProps, mapDispatchToProps)(UserShow)
