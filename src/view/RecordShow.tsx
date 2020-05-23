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
import Render from '@/components/Render'
import StudyRecord from '@/components/StudyRecord'
import store from '@/store'
import RecordForm from '@/components/RecordForm'
import Comment from '@/components/Comment'
import axios, { auth } from '@/axios'

interface Props extends RouteComponentProps<{ id: string }> {
  studyRecords: any
  deleteComment: any
  user: any
}

class UserShow extends React.Component<Props, {}> {
  id!: number
  state = {
    isLoading: true,
    payload: {
      user: {
        id: 0
      },
      record: {
        id: 1
      }
    }
  }

  async componentDidMount() {
    this.id = Number(this.props.match.params.id)
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/study_records/${this.id}`,
      auth
    )
    console.log(res.data, 'USERSHOW')

    this.setState({ payload: res.data, isLoading: false })
  }

  renderIfRecordHasComment = comments => {
    if (!comments) return
    return (
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <Comment data={comment} recordId={this.id}></Comment>
          </li>
        ))}
      </ul>
    )
  }

  test = () => {
    const {
      isLoading,
      payload,
      payload: { user, record, comments }
    } = this.state as any
    if (isLoading) {
      return <>loading</>
    }
    return (
      <>
        {!isLoading && (
          <div className="mb40">
            <StudyRecord record={payload} link={false}></StudyRecord>
          </div>
        )}
        {this.renderIfRecordHasComment(comments)}
      </>
    )
  }

  onClickBack: (() => void) | null = () => {
    this.props.history.goBack()
  }

  render() {
    const {
      isLoading,
      payload: { user, record, comments }
    } = this.state as any
    const correctUser = user.id === this.props.user.id
    return (
      <div className="l-inner">
        <button
          onClick={() => this.onClickBack!()}
          type="button"
          className="button-back mb20 mr15"
        >
          戻る
        </button>
        <Modal
          openButtonText="コメントする"
          buttonClassName="button-comment mb20 mr15"
        >
          <CommentForm recordId={this.id}></CommentForm>
        </Modal>
        <Render if={correctUser}>
          <Modal openButtonText="編集" buttonClassName="button-edit">
            <RecordForm type="edit"></RecordForm>
          </Modal>
        </Render>
        {this.test()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  studyRecords: state.studyRecords,
  user: state.user
})
const mapDispatchToProps = { getStudyRecord, readStudyRecords, deleteComment }

export default connect(mapStateToProps, mapDispatchToProps)(UserShow)
