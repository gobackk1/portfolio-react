import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import Modal from '@/components/Modal'
import ProfileForm from '@/components/ProfileForm'
import FollowButton from '@/components/FollowButton'
import store from '@/store'
import { readProfileStudyRecords } from '@/actions/userProfile'
import { getUser } from '@/actions/users'
import RecordsList from '@/components/RecordsList'
import DotSpinner from '@/components/DotSpinner'
import { logout } from '@/actions/user'

interface Props extends RouteComponentProps<{ id: string }> {
  user: any
  users: any
  userProfile: any
}

class Profile extends React.Component<Props> {
  userId!: number
  currentUser!: boolean
  state = {
    isLoadingStudyRecords: true
  }

  constructor(props) {
    super(props)
    this.currentUser = this.props.match.params.id ? false : true
    this.userId = this.props.match.params.id
      ? Number(this.props.match.params.id)
      : this.props.user.id
    this.getUserIfNotFound()
    this.dispatchReadProfileStudyRecords()
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  getUserIfNotFound = async () => {
    const { data } = this.props.users
    const index = data.findIndex(d => d.id === this.userId)
    if (index === -1) {
      await store.dispatch(getUser(this.userId))
    }
  }

  dispatchReadProfileStudyRecords = async () => {
    await store.dispatch(
      readProfileStudyRecords({
        id: this.userId,
        page: 1,
        per: 10,
        initialize: true
      })
    )
  }

  onClickLogout = () => {
    if (window.confirm('本当にログアウトしますか？')) {
      store.dispatch(logout())
      this.props.history.push('/')
    }
  }

  render() {
    const correctUser = Number(this.userId) === this.props.user.id
    const { data } = this.props.users
    const { records, isLoading, onLoadStudyRecords } = this.props.userProfile
    const index = data.findIndex(d => d.id === this.userId)
    if (index === -1)
      return (
        <div className="l-inner">
          <div className="tac">
            <DotSpinner></DotSpinner>
          </div>
        </div>
      )
    const update = this.getUserIfNotFound
    const {
      registered_date,
      is_following,
      followings_count,
      followers_count,
      total_study_hours,
      image_url,
      name,
      user_bio,
      id
    } = data[index]
    return (
      <div className="l-inner">
        <div className="profile">
          <div className="profile__head">
            <img
              src={`${process.env.REACT_APP_API_URL}${image_url}`}
              width="120"
              height="120"
              alt="ユーザープロフィール画像"
            />
            <div className="profile__head-button">
              {correctUser && (
                <>
                  <Modal
                    openButtonText="編集"
                    buttonClassName="button-edit mr20"
                  >
                    <ProfileForm update={update}></ProfileForm>
                  </Modal>
                  <button
                    onClick={this.onClickLogout}
                    type="button"
                    className="button-logout"
                  >
                    ログアウト
                  </button>
                </>
              )}
              {!correctUser && (
                <FollowButton
                  followId={id}
                  isFollowing={is_following}
                ></FollowButton>
              )}
            </div>
          </div>
          <div className="profile__name">{name}</div>
          <div className="profile__registered">{registered_date} 登録</div>
          <div className="profile__bio">{user_bio}</div>
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
        {isLoading && (
          <div className="tac">
            <DotSpinner></DotSpinner>
          </div>
        )}
        <RecordsList
          data={records}
          onLoadStudyRecords={onLoadStudyRecords}
        ></RecordsList>
        {isLoading && (
          <div className="tac">
            <DotSpinner></DotSpinner>
          </div>
        )}
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
