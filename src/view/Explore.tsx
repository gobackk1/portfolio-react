import React from 'react'
import { connect } from 'react-redux'
import { readUsers, searchUsers, clearUsersStateData } from '@/actions/users'
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
  search = {
    currentPage: 1,
    perPage: 10
  }
  state = {
    loading: false,
    mode: 'index',
    onLoadUsersList: () => {},
    onLoadRecordsList: () => {}
  }

  componentDidMount() {
    this.initialize()
    this.setState({
      onLoadUsersList: this.loadUsersList,
      onLoadRecordsList: this.loadRecordsList
    })
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
    this.users.currentPage++
    try {
      await store.dispatch(
        readUsers({
          page: this.users.currentPage,
          per: this.users.perPage
        })
      )
    } catch (e) {
      // TODO: error内容によって処理を分岐させる必要がある
      // NOTE: onEnterがnullを受け付けない
      this.loadUsersList = undefined
      this.users.currentPage--
    }
    this.setState({ loading: false })
  }

  loadRecordsList: (() => Promise<void>) | undefined = async () => {
    this.setState({ loading: true })
    this.records.currentPage++
    try {
      await store.dispatch(
        readStudyRecords({
          page: this.records.currentPage,
          per: this.records.perPage
        })
      )
    } catch (e) {
      // TODO: error内容によって処理を分岐させる必要がある
      // NOTE: onEnterがnullを受け付けない
      this.loadRecordsList = undefined
      this.records.currentPage--
    }
    this.setState({ loading: false })
  }

  dispatchSearchUsers = async keyword => {
    try {
      await store.dispatch(
        searchUsers({
          keyword,
          page: this.search.currentPage,
          per: this.search.perPage
        })
      )
    } catch (e) {
      console.log(e, 'mock')
    }
  }

  onChange = async ({ nativeEvent }) => {
    const keyword = nativeEvent.target.value

    this.search.currentPage = 1
    this.setState({
      onLoadUsersList: () => {
        this.search.currentPage++
        this.dispatchSearchUsers(keyword).catch(() => this.search.currentPage--)
      }
    })

    if (this.searchQueue) {
      clearTimeout(this.searchQueue)
      this.searchQueue = null
    }

    this.searchQueue = window.setTimeout(() => {
      if (this.isUsersPage()) {
        store.dispatch(clearUsersStateData())
        this.dispatchSearchUsers(keyword)
      } else {
        store.dispatch(searchStudyRecords(keyword))
      }
    }, 500)
  }

  render() {
    const { match } = this.props
    const { onLoadRecordsList, onLoadUsersList, loading } = this.state
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
                onEnter={onLoadUsersList}
                bottomOffset="-200px"
              ></Waypoint>
              {loading && '読み込み中MOCK'}
            </Route>
            <Route path={`${match.url}/studyrecords`}>
              <RecordsList></RecordsList>
              <Waypoint
                onEnter={onLoadRecordsList}
                bottomOffset="-200px"
              ></Waypoint>
              {loading && '読み込み中MOCK'}
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
