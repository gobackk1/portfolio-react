import React from 'react'
import { connect } from 'react-redux'
import axios, { auth } from '@/axios'
import { Link, Switch, Route, RouteComponentProps } from 'react-router-dom'
import Render from '@/components/Render'
import Modal from '@/components/Modal'
import StudyRecord from '@/components/StudyRecord'
import ProfileForm from '@/components/ProfileForm'
import FollowButton from '@/components/FollowButton'

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
    total_study_hours: 0,
    followings_count: 0,
    followers_count: 0,
    is_following: false
  }

  userId: number = this.props.match.params.id
    ? Number(this.props.match.params.id)
    : this.props.user.id

  setAnotherUserProfile = async (id: number) => {
    this.setState({
      loaded: false
    })
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${id}`,
      auth
    )

    this.setState({
      ...res.data,
      loaded: true
    })
  }

  setCurrentUserProfile = () => {
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
    console.log(this.state, 'test')

    return (
      <>
        <h2>プロフィール</h2>
        <Render if={correctUser}>
          <Modal openButtonText="編集">
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
        <h3>プロフィール</h3>
        <img
          src={`${process.env.REACT_APP_API_URL}/images/user_images/${this.state.user.image_name}`}
          width="300"
          alt="ユーザープロフィール画像"
        />
        <ul>
          <li>ユーザーID:{this.state.user.id}</li>
          <li>ユーザーネーム:{this.state.user.name}</li>
          <li>参加:{this.state.user.created_at}</li>
          <li>自己紹介:{this.state.user.user_bio}</li>
          <li>総勉強時間:{this.state.total_study_hours}</li>
          <li>フォロー:{this.state.followings_count}</li>
          <li>フォロワー:{this.state.followers_count}</li>
        </ul>
        <h3>勉強記録</h3>
        <ul>
          {this.state.study_records.map((record, index) => (
            <li key={index}>
              <StudyRecord record={record}></StudyRecord>
            </li>
          ))}
        </ul>
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  userProfile: state.userProfile
})

export default connect(mapStateToProps, null)(Profile)
