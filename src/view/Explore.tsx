import React from 'react'
import { connect } from 'react-redux'
import { logout, login } from '@/actions'
import axios from '@/axios'
import { Link, Switch, Route } from 'react-router-dom'

// const email = 'example@test.com'
// const password = 'foobar'

interface Props {
  user: any
  login: any
}

class Explore extends React.Component<Props, {}> {
  state = {
    users: [
      {
        id: 0,
        name: ''
      }
    ]
  }
  async fetchData(): Promise<void> {
    // try {
    //   await this.props.login({
    //     email,
    //     password
    //   })
    // } catch (e) {
    //   console.log(e)
    // }
    const auth: any = {
      auth: true
    }
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, auth)
    console.log(res.data, 'resdata')

    this.setState({
      users: res.data
    })
    console.log(this.state.users, 'users')
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <>
        <h3>Users List</h3>
        <ul>
          {this.state.users.map((user, index) => {
            return (
              <li key={index}>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </li>
            )
          })}
        </ul>
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user
})

const mapDispatchToProps = { login }

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
