import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import _ from 'lodash'
class UsersList extends React.Component<{ users?: any }> {
  render() {
    return (
      <>
        <h3>Users List</h3>
        <ul>
          {_.map(this.props.users, (user, index) => {
            return (
              <li key={index}>
                <Link to={`/profile/${user.id}`}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/images/user_images/${user.image_name}`}
                    width="100"
                    alt={user.name}
                  />
                  <div>ユーザー名{user.name}</div>
                  <div>自己紹介{user.user_bio}</div>
                </Link>
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

export default connect(mapStateToProps, null)(UsersList)
