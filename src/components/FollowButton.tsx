import React from 'react'
import { followUser, unFollowUser } from '@/actions/users'
import { connect } from 'react-redux'
import store from '@/store'

interface Props {
  followId: number
  isFollowing: boolean
  followUser: any
  unFollowUser: any
}

class FollowButton extends React.Component<Props, {}> {
  state = {
    isFollowing: this.props.isFollowing,
    disabled: false
  }

  createFollow = async id => {
    this.setState({ disabled: true })
    await this.props.followUser(id)
    this.setState({ isFollowing: true, disabled: false })
  }

  destroyFollow = async id => {
    if (!window.confirm('本当にフォローを解除しますか？')) return
    this.setState({ disabled: true })
    await this.props.unFollowUser(id)
    this.setState({ isFollowing: false, disabled: false })
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
        className={isFollowing ? 'button-follow--following' : 'button-follow'}
        type="button"
      >
        {isFollowing ? 'フォロー済み' : 'フォローする'}
      </button>
    )
  }
}

const mapDispatchToProps = { followUser, unFollowUser }

export default connect(null, mapDispatchToProps)(FollowButton)
