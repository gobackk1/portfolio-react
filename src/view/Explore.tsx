import React from 'react'
import { connect } from 'react-redux'
import { readUsers, searchUsers } from '@/actions/users'
import { readStudyRecords } from '@/actions/studyRecords'
import { searchStudyRecords } from '@/actions/studyRecords'
import UsersList from '@/components/UsersList'
import classNames from 'classnames'
import store from '@/store'
import { Waypoint } from 'react-waypoint'

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
  searchUsers: any
  searchStudyRecords: any
}

class Explore extends React.Component<Props, {}> {
  searchQueue: number | null = null
  isUsersPage: () => boolean = () => /users/.test(window.location.pathname)
  isRecordsPage: () => boolean = () =>
    /studyrecords/.test(window.location.pathname)
  users = {
    currentPage: 1,
    perPage: 10
  }
  records = {
    currentPage: 1,
    perPage: 10
  }
  state = {
    loading: false
  }

  componentWillMount() {
    this.initialize()
  }

  initialize = async () => {
    this.setState({ loading: true })
    await Promise.all([
      store.dispatch(
        readUsers({
          page: this.users.currentPage,
          per: this.users.perPage
        })
      ),
      store.dispatch(
        readStudyRecords({
          page: this.records.currentPage,
          per: this.records.perPage
        })
      )
    ])
    this.setState({ loading: false })
  }

  loadUsersList: (() => Promise<void>) | undefined = async () => {
    this.setState({ loading: true })
    try {
      await store.dispatch(
        readUsers({
          page: this.users.currentPage,
          per: this.users.perPage
        })
      )
      this.users.currentPage++
    } catch (e) {
      // NOTE: onEnterがnullを受け付けない
      this.loadUsersList = undefined
    }
    this.setState({ loading: false })
  }

  loadRecordsList: (() => Promise<void>) | undefined = async () => {
    this.setState({ loading: true })
    try {
      await store.dispatch(
        readStudyRecords({
          page: this.records.currentPage,
          per: this.records.perPage
        })
      )
      this.records.currentPage++
    } catch (e) {
      // NOTE: onEnterがnullを受け付けない
      this.loadRecordsList = undefined
    }
    this.setState({ loading: false })
  }

  onChange = ({ nativeEvent }) => {
    if (this.searchQueue) {
      clearTimeout(this.searchQueue)
      this.searchQueue = null
    }
    this.searchQueue = window.setTimeout(() => {
      if (this.isUsersPage()) {
        store.dispatch(searchUsers(nativeEvent.target.value))
      } else {
        store.dispatch(searchStudyRecords(nativeEvent.target.value))
      }
    }, 500)
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
              <Waypoint
                onEnter={this.loadUsersList}
                bottomOffset="-200px"
              ></Waypoint>
              {this.state.loading && '読み込み中MOCK'}
            </Route>
            <Route path={`${match.url}/studyrecords`}>
              <RecordsList></RecordsList>
              <Waypoint
                onEnter={this.loadRecordsList}
                bottomOffset="-200px"
              ></Waypoint>
              {this.state.loading && '読み込み中MOCK'}
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

export default connect(mapStateToProps, null)(Explore)
