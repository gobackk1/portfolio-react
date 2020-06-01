import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import FollowButton from '@/components/FollowButton'
import LoadSpinner from '@/components/LoadSpinner'
import { Waypoint } from 'react-waypoint'
import store from '@/store'
import { spawn } from 'child_process'

interface Props extends RouteComponentProps {
  users?: any
}
class UsersList extends React.Component<Props, any> {
  onClickUserList = (id: number, { nativeEvent }) => {
    if (nativeEvent.target.tagName.toLowerCase() === 'button') return
    this.props.history.push(`/profile/${id}`)
  }

  render() {
    const { onLoadUsers, isLoading, data } = this.props.users
    const dataWithoutCurrentUser = data.filter(
      d => d.id !== store.getState().user.id
    )
    return (
      <>
        <ul className="users-list">
          {dataWithoutCurrentUser.map((d, index) => {
            const { image_url, id, name, user_bio, is_following } = d
            return (
              <li
                key={index}
                className="users-list__item card-user card-user--enable-link"
                onClick={e => this.onClickUserList(id, e)}
              >
                <div className="card-user__profile">
                  <div className="card-user__profile-head">
                    <img
                      src={`${process.env.REACT_APP_API_URL}${image_url}`}
                      width="80"
                      height="80"
                      alt={name}
                    />
                  </div>
                  <div className="card-user__profile-body">
                    <div className="card-user__profile-name">{name}</div>
                    {user_bio}
                  </div>
                </div>
                <div className="card-user__follow">
                  <FollowButton
                    followId={id}
                    isFollowing={is_following}
                  ></FollowButton>
                </div>
              </li>
            )
          })}
        </ul>
        <Waypoint onEnter={onLoadUsers} bottomOffset="-400px"></Waypoint>
        <LoadSpinner active={isLoading}></LoadSpinner>
      </>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users
})

export default connect(mapStateToProps, null)(withRouter(UsersList))
