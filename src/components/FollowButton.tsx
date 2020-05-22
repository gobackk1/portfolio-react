import React from 'react'
import axios, { auth } from '@/axios'
import { followUser, unFollowUser } from '@/actions/users'
import { connect } from 'react-redux'
import store from '@/store'
import { setUserProfileState } from '@/actions/userProfile'

const relationshipUrl: string = `${process.env.REACT_APP_API_URL}/relationships`

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
    const nowCount = store.getState().userProfile.data.followers_count
    store.dispatch(setUserProfileState({ followers_count: nowCount + 1 }))
    await this.props.followUser(id)
    this.setState({ isFollowing: true, disabled: false })
  }

  destroyFollow = async id => {
    if (!window.confirm('本当にフォローを解除しますか？')) return
    this.setState({ disabled: true })
    await this.props.unFollowUser(id)
    const nowCount = store.getState().userProfile.data.followers_count
    console.log(nowCount)
    store.dispatch(setUserProfileState({ followers_count: nowCount - 1 }))

    this.setState({
      isFollowing: false,
      disabled: false
    })
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
