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

  async componentWillMount() {
    this.id = Number(this.props.match.params.id)
    window.scrollTo(0, 0)
    await store.dispatch(getStudyRecord(this.id))
  }

  onClickBack: (() => void) | null = () => {
    this.props.history.goBack()
  }

  render() {
    const { records } = this.props.studyRecords
    const index = records.findIndex(r => r.id === this.id)
    if (index === -1) return <></>
    const { user, record, comments } = records[index]
    const correctUser = user.id === this.props.user.id
    return (
      <div className="l-inner">
        <button
          onClick={() => this.onClickBack!()}
          type="button"
          className="button-back--large mb20 mr15"
        >
          <i className="fas fa-arrow-left dib mr5"></i>一覧へ戻る
        </button>
        <Modal
          openButtonText="コメントする"
          buttonClassName="button-comment--large mb20 mr15"
          icon={<i className="far fa-comment dib mr5"></i>}
        >
          <CommentForm recordId={this.id}></CommentForm>
        </Modal>
        <Render if={correctUser}>
          <Modal
            openButtonText="編集"
            buttonClassName="button-edit--large"
            icon={<i className="fas fa-pen dib mr5"></i>}
          >
            <RecordForm type="edit"></RecordForm>
          </Modal>
        </Render>
        <div className="mb40">
          <StudyRecord record={records[index]} link={false}></StudyRecord>
        </div>
        <h3 className="title-m mb15">コメント</h3>
        <ul>
          {!comments.length && (
            <div className="not-found">コメントはありません</div>
          )}
          {comments.map((comment, index) => (
            <li key={index}>
              <Comment data={comment} recordId={this.id}></Comment>
            </li>
          ))}
        </ul>
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
