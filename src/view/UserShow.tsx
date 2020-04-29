import React from 'react'
import { connect } from 'react-redux'
import { logout, login } from '@/actions'
import axios from '@/axios'
import { AxiosBasicCredentials } from 'axios'
import store from '@/store'
import { Link, Switch, Route, RouteComponentProps } from 'react-router-dom'
import user from '@/reducers/user'

interface Props extends RouteComponentProps<{ id: string }> {}

class UserShow extends React.Component<Props, {}> {
  state = {
    user: {
      id: 0,
      name: '',
      email: '',
      created_at: ''
    }
  }

  async fetchData(): Promise<void> {
    try {
      const auth = {
        auth: true as any
      }
      const { id } = this.props.match.params

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${id}`,
        auth
      )

      this.setState({
        user: res.data
      })
    } catch (e) {
      console.log(e)
      this.props.history.push('/')
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  render() {
    return (
      <>
        <h3>Users detail</h3>
        <ul>
          <li>{this.state.user.id}</li>
          <li>{this.state.user.name}</li>
          <li>{this.state.user.email}</li>
          <li>{this.state.user.created_at}</li>
        </ul>
        <Link to="/explore">戻る</Link>
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user
})

export default connect(mapStateToProps, null)(UserShow)
