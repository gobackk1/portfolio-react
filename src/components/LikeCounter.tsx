import React from 'react'
import axios, { auth } from '@/axios'

interface Props {
  record: any
}

class LikeCounter extends React.Component<Props, {}> {
  state = {
    isLiked: false,
    count: 0,
    disabled: false
  }

  likeUrl: string = `${process.env.REACT_APP_API_URL}/likes`

  fetchCount = async id => {
    this.setState({ disabled: true })
    const res = await axios.get(`${this.likeUrl}/${id}/all`, auth)
    this.setState({ ...res.data, disabled: false })
  }

  createLike = async study_record_id => {
    this.setState({ disabled: true })
    const res = await axios.post(this.likeUrl, { study_record_id }, auth)
    this.setState({ ...res.data, disabled: false })
  }

  destroyLike = async id => {
    this.setState({ disabled: true })
    const res = await axios.delete(`${this.likeUrl}/${id}`, auth)
    this.setState({ ...res.data, disabled: false })
  }

  onClickLike = id => {
    this.state.isLiked ? this.destroyLike(id) : this.createLike(id)
  }

  componentDidMount() {
    this.fetchCount(this.props.record.id)
  }

  render() {
    const { id } = this.props.record
    return (
      <>
        <button
          onClick={() => this.onClickLike(id)}
          disabled={this.state.disabled}
        >
          {this.state.isLiked ? 'いいね済み' : 'いいねする'}
          {this.state.count}
        </button>
      </>
    )
  }
}

export default LikeCounter
