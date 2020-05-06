import React from 'react'
import { connect } from 'react-redux'
import { readUsers, searchUsers } from '@/actions/users'
import { searchStudyRecords } from '@/actions/studyRecords'
import UsersList from '@/components/UsersList'
import classNames from 'classnames'
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
  isUsersPage: () => boolean = () => /users/.test(window.location.pathname)
  isRecordsPage: () => boolean = () =>
    /studyrecords/.test(window.location.pathname)

  componentWillMount() {
    this.props.readUsers()
  }

  onChange = ({ nativeEvent }) => {
    if (this.searchQueue) {
      clearTimeout(this.searchQueue)
      this.searchQueue = null
    }
    const queue = window.setTimeout(() => {
      if (this.isUsersPage()) {
        this.props.searchUsers(nativeEvent.target.value)
      } else {
        this.props.searchStudyRecords(nativeEvent.target.value)
      }
    }, 500)
    this.searchQueue = queue
  }

  render() {
    const { match } = this.props
    const userTabClassName = classNames({
      'tab__list-item': !this.isUsersPage(),
      'tab__list-item--active': this.isUsersPage()
    })
    const recordTabClassName = classNames({
      'tab__list-item': !this.isRecordsPage(),
      'tab__list-item--active': this.isRecordsPage()
    })
    return (
      <div className="tab">
        <div className="tab__list">
          <Link to={`${match.url}/users`} className={userTabClassName}>
            ユーザー
          </Link>
          <Link to={`${match.url}/studyrecords`} className={recordTabClassName}>
            勉強記録
          </Link>
        </div>
        <div className="search">
          <input
            type="text"
            onChange={this.onChange}
            className="search__input"
            placeholder="検索"
          />
        </div>
        <div className="tab__body">
          <Switch>
            <Route path={`${match.url}/users`}>
              <UsersList></UsersList>
            </Route>
            <Route path={`${match.url}/studyrecords`}>
              <RecordsList></RecordsList>
            </Route>
          </Switch>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user
})

const mapDispatchToProps = { readUsers, searchUsers, searchStudyRecords }

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
