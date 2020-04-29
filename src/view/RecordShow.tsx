import React from 'react'
import { connect } from 'react-redux'
import { getStudyRecord } from '@/actions'
import { Link, Switch, Route, RouteComponentProps } from 'react-router-dom'
import Modal from '@/components/Modal'
import CommentForm from '@/components/CommentForm'

interface Props extends RouteComponentProps<{ id: string }> {
  getStudyRecord: any
}

class UserShow extends React.Component<Props, {}> {
  state = {
    record: {
      id: 0,
      user_id: 0,
      comment: '',
      teaching_material: '',
      study_hours: 0
    }
  }

  async fetchData(): Promise<void> {
    try {
      // TODO: 'axios-middleware'で追加したconfigを型安全にする
      // 'redux-axios-middleware'使えばできそう
      const auth = {
        auth: true as any
      }
      const { id } = this.props.match.params

      const res = await this.props.getStudyRecord(id)

      this.setState({
        record: res.data
      })
    } catch (e) {
      console.log(e)
      this.props.history.push('/')
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <>
        <h3>Record detail</h3>
        <ul>
          <li>{this.state.record.id}</li>
          <li>{this.state.record.user_id}</li>
          <li>{this.state.record.comment}</li>
          <li>{this.state.record.teaching_material}</li>
          <li>{this.state.record.study_hours}</li>
        </ul>
        <Link to="/record">戻る</Link>
        <Link to={`/record/${this.props.match.params.id}/edit`}>編集</Link>
        <Modal content={<CommentForm></CommentForm>}>コメント</Modal>
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user
})
const mapDispatchToProps = { getStudyRecord }

export default connect(mapStateToProps, mapDispatchToProps)(UserShow)
