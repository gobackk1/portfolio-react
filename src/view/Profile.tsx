import React from 'react'
import { connect } from 'react-redux'
import axios, { auth } from '@/axios'
import { Link, Switch, Route, RouteComponentProps } from 'react-router-dom'
import Render from '@/components/Render'
import Modal from '@/components/Modal'
import ProfileForm from '@/components/ProfileForm'
import FollowButton from '@/components/FollowButton'
import store from '@/store'
import { getProfile, setUserProfileState } from '@/actions/userProfile'
import RecordsList from '@/components/RecordsList'

interface Props extends RouteComponentProps<{ id: string }> {
  user: any
  userProfile: any
}
interface State {}

class Profile extends React.Component<Props, State> {
  currentUser!: boolean

  userId: number = this.props.match.params.id
    ? Number(this.props.match.params.id)
    : this.props.user.id

  constructor(props) {
    super(props)
    this.currentUser = this.props.match.params.id ? false : true
  }

  setAnotherUserProfile = async (id: number) => {
    await store.dispatch(getProfile(id))
  }

  setCurrentUserProfile = async (id: number) => {
    await store.dispatch(getProfile(id))
  }

  componentDidMount() {
    this.props.user.id === this.userId
      ? this.setCurrentUserProfile(this.userId)
      : this.setAnotherUserProfile(this.userId)
  }

  render() {
    const correctUser = Number(this.userId) === this.props.user.id
    const {
      data: {
        records,
        user,
        is_following,
        registered_date,
        followings_count,
        followers_count,
        total_study_hours
      }
    } = this.props.userProfile

    const update = this.currentUser ? this.setCurrentUserProfile : null
    return (
      <div className="l-inner">
        <div className="profile">
          <div className="profile__head">
            <img
              src={`${process.env.REACT_APP_API_URL}${user.image_url}`}
              width="120"
              height="120"
              alt="ユーザープロフィール画像"
            />
            <Render if={correctUser}>
              <Modal openButtonText="編集" buttonClassName="button-edit">
                <ProfileForm update={update}></ProfileForm>
              </Modal>
            </Render>
            <Render if={!correctUser}>
              <FollowButton
                followId={user.id}
                isFollowing={is_following}
              ></FollowButton>
            </Render>
          </div>
          <div className="profile__name">{user.name}</div>
          <div className="profile__registered">{registered_date} 登録</div>
          <div className="profile__bio">{user.user_bio}</div>
          <div className="profile__footer">
            <span className="profile__footer-item">
              フォロー {followings_count}
            </span>
            <span className="profile__footer-item">
              フォロワー {followers_count}
            </span>
            <span className="profile__footer-item">
              総勉強時間 {total_study_hours}時間
            </span>
          </div>
        </div>
        <RecordsList records={records} page="profile"></RecordsList>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  userProfile: state.userProfile
})

export default connect(mapStateToProps, null)(Profile)
