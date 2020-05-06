import React from 'react'
import axios, { auth } from '@/axios'
import { followUser, unFollowUser } from '@/actions/users'
import { connect } from 'react-redux'

const relationshipUrl: string = `${process.env.REACT_APP_API_URL}/relationships`

interface Props {
  followId: number
  isFollowing: boolean
  updateFollowerCount?: any
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
    if (this.props.updateFollowerCount) {
      this.props.updateFollowerCount(1)
    }
    this.setState({ isFollowing: true, disabled: false })
  }

  destroyFollow = async id => {
    this.setState({ disabled: true })
    await this.props.unFollowUser(id)
    if (this.props.updateFollowerCount) {
      this.props.updateFollowerCount(-1)
    }
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
