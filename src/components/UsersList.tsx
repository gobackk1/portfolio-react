import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
import FollowButton from '@/components/FollowButton'

interface Props extends RouteComponentProps {
  users?: any
}
class UsersList extends React.Component<Props, any> {
  onClickUserList = (id: number, { nativeEvent }) => {
    if (nativeEvent.target.tagName.toLowerCase() === 'button') return
    this.props.history.push(`/profile/${id}`)
  }
  render() {
    return (
      <>
        <ul className="users-list">
          {_.map(this.props.users, (user, index) => {
            return (
              <li
                key={index}
                className="users-list__item card-user"
                onClick={e => this.onClickUserList(user.id, e)}
              >
                <div className="card-user__profile profile">
                  <div className="profile__head">
                    <img
                      src={`${process.env.REACT_APP_API_URL}/images/user_images/${user.image_name}`}
                      width="80"
                      height="80"
                      alt={user.name}
                    />
                  </div>
                  <div className="profile__body">
                    <div className="profile__name">{user.name}</div>
                    {user.user_bio}
                  </div>
                </div>
                <div className="card-user__follow">
                  <FollowButton
                    followId={user.id}
                    isFollowing={user.is_following}
                  ></FollowButton>
                </div>
              </li>
            )
          })}
        </ul>
      </>
    )
  }
}

const mapStateToProps = state => ({
  users: state.users
})

export default connect(mapStateToProps, null)(withRouter(UsersList))
