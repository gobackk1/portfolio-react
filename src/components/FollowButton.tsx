import React from 'react'
import axios, { auth } from '@/axios'

const relationshipUrl: string = `${process.env.REACT_APP_API_URL}/relationships`

interface Props {
  followId: number
  isFollowing: boolean
  updateFollowerCount: any
}

class FollowButton extends React.Component<Props, {}> {
  state = {
    isFollowing: this.props.isFollowing,
    disabled: false
  }

  createFollow = async id => {
    this.setState({ disabled: true })
    const res = await axios.post(relationshipUrl, { id }, auth)
    this.props.updateFollowerCount(res.data.followers_count)
    this.setState({ isFollowing: res.data.is_following, disabled: false })
  }

  destroyFollow = async id => {
    this.setState({ disabled: true })
    const res = await axios.delete(`${relationshipUrl}/${id}`, auth)
    this.props.updateFollowerCount(res.data.followers_count)
    this.setState({ isFollowing: res.data.is_following, disabled: false })
  }

  onClickFollow = id => {
    this.state.isFollowing ? this.destroyFollow(id) : this.createFollow(id)
  }

  render() {
    const { disabled, isFollowing } = this.state
    return (
      <button
        onClick={() => this.onClickFollow(this.props.followId)}
        disabled={disabled}
      >
        {isFollowing ? 'フォロー済み' : 'フォローする'}
      </button>
    )
  }
}

export default FollowButton
