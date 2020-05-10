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

interface Props extends RouteComponentProps<{ id: string }> {
  studyRecords: any
  deleteComment: any
  user: any
}

class UserShow extends React.Component<Props, {}> {
  id!: number

  constructor(props) {
    super(props)
    this.id = Number(this.props.match.params.id)
  }

  async componentDidMount() {
    if (!this.props.studyRecords.loaded) {
      await store.dispatch(readStudyRecords())
    }
    await store.dispatch(getStudyRecord(this.id))
  }

  renderIfRecordHasComment = comments => {
    if (!comments) return
    console.log(comments, 'comments')

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

  onClickBack: (() => void) | null = () => {
    this.props.history.goBack()
  }

  renderIfLoaded = () => {
    const { loaded, records } = this.props.studyRecords
    if (!loaded) return

    const index = records.findIndex(r => r.id === this.id)
    const {
      record: { user_id },
      comments
    } = records[index]

    return (
      <>
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
        <Render if={user_id === this.props.user.id}>
          <Modal openButtonText="編集" buttonClassName="button-edit">
            <RecordForm type="edit"></RecordForm>
          </Modal>
        </Render>
        <div className="mb40">
          <StudyRecord record={records[index]} link={false}></StudyRecord>
        </div>
        {this.renderIfRecordHasComment(comments)}
      </>
    )
  }

  render() {
    return <div className="l-inner">{this.renderIfLoaded()}</div>
  }
}

const mapStateToProps = state => ({
  studyRecords: state.studyRecords,
  user: state.user
})
const mapDispatchToProps = { getStudyRecord, readStudyRecords, deleteComment }

export default connect(mapStateToProps, mapDispatchToProps)(UserShow)
