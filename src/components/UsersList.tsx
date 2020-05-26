import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import FollowButton from '@/components/FollowButton'
import DotSpinner from '@/components/DotSpinner'
import { Waypoint } from 'react-waypoint'

interface Props extends RouteComponentProps {
  users?: any
}
class UsersList extends React.Component<Props, any> {
  onClickUserList = (id: number, { nativeEvent }) => {
    if (nativeEvent.target.tagName.toLowerCase() === 'button') return
    this.props.history.push(`/profile/${id}`)
  }

  render() {
    const { onLoadUsers, isLoading } = this.props.users
    return (
      <>
        <ul className="users-list">
          {_.map(this.props.users.data, (d, index) => {
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
        {isLoading && (
          <div className="tac">
            <DotSpinner></DotSpinner>
          </div>
        )}
      </>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users
})

export default connect(mapStateToProps, null)(withRouter(UsersList))
