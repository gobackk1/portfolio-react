import React from 'react'
import { connect } from 'react-redux'
import axios, { auth } from '@/axios'
import { Link, Switch, Route, RouteComponentProps } from 'react-router-dom'
import RenderIfCorrectUser from '@/components/RenderIfCorrectUser'
import RenderIfWrongUser from '@/components/RenderIfWrongUser'
import Modal from '@/components/Modal'
import StudyRecord from '@/components/StudyRecord'
import ProfileForm from '@/components/ProfileForm'

interface Props extends RouteComponentProps<{ id: string }> {
  user: any
  userProfile: any
}
interface State {}

class Profile extends React.Component<Props, State> {
  state = {
    user: {
      id: 0,
      name: '',
      email: '',
      created_at: '',
      user_bio: '',
      image_name: 'default.png'
    },
    study_records: [{ comment: '', teaching_material: '', study_hours: 0 }],
    total_study_hours: 0
  }

  userId: number = this.props.match.params.id
    ? Number(this.props.match.params.id)
    : this.props.user.id

  setAnotherUserProfile = async (id: number) => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${id}`,
      auth
    )

    this.setState(res.data)
  }

  setCurrentUserProfile = () => {
    this.setState(this.props.userProfile)
    console.log(this.state)
  }

  componentDidMount() {
    this.props.user.id === this.userId
      ? this.setCurrentUserProfile()
      : this.setAnotherUserProfile(this.userId)
  }

  render() {
    return (
      <>
        <h2>プロフィール</h2>
        <RenderIfCorrectUser userId={Number(this.userId)}>
          <Modal openButtonText="編集">
            <ProfileForm
              aaaa={() => {
                this.setCurrentUserProfile()
              }}
            ></ProfileForm>
          </Modal>
        </RenderIfCorrectUser>
        <RenderIfWrongUser userId={Number(this.userId)}>
          <button>フォロー</button>
        </RenderIfWrongUser>
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
