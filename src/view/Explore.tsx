import React from 'react'
import { connect } from 'react-redux'
import { readUsers, searchUsers } from '@/actions/users'
import { searchStudyRecords } from '@/actions/studyRecords'
import UsersList from '@/components/UsersList'
import axios, { auth } from '@/axios'
import {
  Link,
  Switch,
  Route,
  useRouteMatch,
  RouteComponentProps
} from 'react-router-dom'
import RecordsList from '@/components/RecordsList'

interface Props extends RouteComponentProps {
  user: any
  readUsers: any
  searchUsers: any
  searchStudyRecords: any
}

class Explore extends React.Component<Props, {}> {
  searchQueue: number | null = null

  componentWillMount() {
    this.props.readUsers()
  }

  onChange = ({ nativeEvent }) => {
    if (this.searchQueue) {
      clearTimeout(this.searchQueue)
      this.searchQueue = null
    }
    const queue = window.setTimeout(() => {
      if (/users/.test(window.location.pathname)) {
        this.props.searchUsers(nativeEvent.target.value)
      } else {
        this.props.searchStudyRecords(nativeEvent.target.value)
      }
    }, 500)
    this.searchQueue = queue
  }

  render() {
    const { match } = this.props
    return (
      <>
        <input type="text" onChange={this.onChange} />
        <Link to={`${match.url}/users`}>ユーザーリスト</Link>
        <Link to={`${match.url}/studyrecords`}>勉強記録</Link>

        <Switch>
          <Route path={`${match.url}/users`}>
            <UsersList></UsersList>
          </Route>
          <Route path={`${match.url}/studyrecords`}>
            <RecordsList></RecordsList>
          </Route>
        </Switch>
      </>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user
})

const mapDispatchToProps = { readUsers, searchUsers, searchStudyRecords }

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
