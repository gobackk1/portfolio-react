import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import Render from '@/components/Render'
import Modal from '@/components/Modal'
import ProfileForm from '@/components/ProfileForm'
import FollowButton from '@/components/FollowButton'
import store from '@/store'
import {
  getProfile,
  readProfileStudyRecords,
  setUserProfileState
} from '@/actions/userProfile'
import { getUser } from '@/actions/users'
import RecordsList from '@/components/RecordsList'
import DotSpinner from '@/components/DotSpinner'

interface Props extends RouteComponentProps<{ id: string }> {
  user: any
  users: any
  userProfile: any
}
interface State {}

class Profile extends React.Component<Props, State> {
  currentUser!: boolean
  state = {
    isLoadingProfile: true,
    isLoadingStudyRecords: false
  }

  userId!: number

  constructor(props) {
    super(props)
    this.currentUser = this.props.match.params.id ? false : true
    this.userId = this.props.match.params.id
      ? Number(this.props.match.params.id)
      : this.props.user.id
    this.setUserProfile(this.userId)
    console.log('constructor')
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.setState({ isLoadingProfile: false })
  }

  setUserProfile = async (id: number) => {
    store.dispatch(setUserProfileState({ currentPage: 1, records: [] }))
    await this.dispatchGetProfile(id)
    await this.dispatchReadProfileStudyRecords(id)
  }

  dispatchGetProfile: (id: number) => Promise<void> = async id => {
    const { data } = this.props.users

    const index = data.findIndex(d => d.user.id === this.userId)
    console.log(index, 'index')
    if (index === -1) {
      await store.dispatch(getUser(this.userId))
    }
  }

  dispatchReadProfileStudyRecords: (id: number) => Promise<void> = async id => {
    this.setState({
      isLoadingStudyRecords: true
    })
    const { currentPage: page } = store.getState().userProfile
    await store.dispatch(
      readProfileStudyRecords({
        id,
        page,
        per: 10
      })
    )
    this.setState({
      isLoadingStudyRecords: false
    })
  }

  render() {
    const correctUser = Number(this.userId) === this.props.user.id
    const { data } = this.props.users
    const index = data.findIndex(d => d.user.id === this.userId)
    if (index === -1) return <></>
    const update = this.setUserProfile
    const {
      registered_date,
      is_following,
      followings_count,
      user,
      followers_count,
      total_study_hours
    } = data[index]
    const { isLoadingStudyRecords, isLoadingProfile } = this.state
    return (
      <div className="l-inner">
        {isLoadingProfile && (
          <div className="tac">
            <DotSpinner></DotSpinner>
          </div>
        )}
        {!isLoadingProfile && (
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
        )}
        {isLoadingStudyRecords && (
          <div className="tac">
            <DotSpinner></DotSpinner>
          </div>
        )}
        {/* {!isLoadingStudyRecords && (
          <RecordsList records={records} page="profile"></RecordsList>
        )} */}
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  users: state.users,
  userProfile: state.userProfile
})

export default connect(mapStateToProps, null)(Profile)
