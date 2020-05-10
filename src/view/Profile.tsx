import React from 'react'
import { connect } from 'react-redux'
import axios, { auth } from '@/axios'
import { Link, Switch, Route, RouteComponentProps } from 'react-router-dom'
import Render from '@/components/Render'
import Modal from '@/components/Modal'
import StudyRecord from '@/components/StudyRecord'
import ProfileForm from '@/components/ProfileForm'
import FollowButton from '@/components/FollowButton'
import store from '@/store'
import { initProfile } from '@/actions/userProfile'

interface Props extends RouteComponentProps<{ id: string }> {
  user: any
  userProfile: any
}
interface State {}

class Profile extends React.Component<Props, State> {
  state = {
    loaded: true,
    user: {
      id: 0,
      name: '',
      email: '',
      created_at: '',
      user_bio: '',
      image_name: 'default.png'
    },
    study_records: [
      {
        user: {
          name: '',
          image_name: 'default.jpg'
        },
        date: '01/01',
        record: {
          user_id: 0,
          comment: '',
          teaching_material: '',
          study_hours: 0,
          study_record_comments: []
        }
      }
    ],
    // study_records: {
    //   records: [
    //     {
    //       user: {
    //         name: '',
    //         image_name: 'default.jpg'
    //       },
    //       date: '01/01',
    //       record: {
    //         user_id: 0,
    //         comment: '',
    //         teaching_material: '',
    //         study_hours: 0,
    //         study_record_comments: []
    //       }
    //     }
    //   ]
    // },
    total_study_hours: 0,
    followings_count: 0,
    followers_count: 0,
    is_following: false,
    registered_date: ''
  }

  userId: number = this.props.match.params.id
    ? Number(this.props.match.params.id)
    : this.props.user.id

  setAnotherUserProfile = async (id: number) => {
    this.setState({ loaded: false })
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${id}`,
      auth
    )

    this.setState({ ...res.data, loaded: true })
  }

  setCurrentUserProfile = async () => {
    await store.dispatch(initProfile(store.getState().user.id))
    this.setState(this.props.userProfile)
  }

  updateFollowerCount = (i: number) => {
    this.setState({
      followers_count: this.state.followers_count + i
    })
  }

  componentDidMount() {
    this.props.user.id === this.userId
      ? this.setCurrentUserProfile()
      : this.setAnotherUserProfile(this.userId)
  }

  render() {
    const correctUser = Number(this.userId) === this.props.user.id

    return (
      <div className="l-inner">
        <div className="profile">
          <div className="profile__head">
            <img
              src={`${process.env.REACT_APP_API_URL}/images/user_images/${this.state.user.image_name}`}
              width="120"
              height="120"
              alt="ユーザープロフィール画像"
            />
            <Render if={correctUser}>
              <Modal openButtonText="編集" buttonClassName="button-edit">
                <ProfileForm></ProfileForm>
              </Modal>
            </Render>
            <Render if={!correctUser && this.state.loaded}>
              <FollowButton
                followId={this.state.user.id}
                isFollowing={this.state.is_following}
                updateFollowerCount={isFollowing =>
                  this.updateFollowerCount(isFollowing)
                }
              ></FollowButton>
            </Render>
          </div>
          <div className="profile__name">{this.state.user.name}</div>
          <div className="profile__registered">
            {this.state.registered_date} 登録
          </div>
          <div className="profile__bio">{this.state.user.user_bio}</div>
          <div className="profile__footer">
            <span className="profile__footer-item">
              フォロー {this.state.followings_count}
            </span>
            <span className="profile__footer-item">
              フォロワー {this.state.followers_count}
            </span>
            <span className="profile__footer-item">
              総勉強時間 {this.state.total_study_hours}時間
            </span>
          </div>
        </div>
        <ul className="record-list">
          {this.state.study_records.map((record, index) => (
            <li key={index} className="record-list__item">
              <StudyRecord record={record}></StudyRecord>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  userProfile: state.userProfile
})

export default connect(mapStateToProps, null)(Profile)
