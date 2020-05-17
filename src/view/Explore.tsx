import React from 'react'
import { connect } from 'react-redux'
import { readUsers, searchUsers, clearUsersStateData } from '@/actions/users'
import {
  readStudyRecords,
  clearStudyRecordsStateData
} from '@/actions/studyRecords'
import { searchStudyRecords } from '@/actions/studyRecords'
import UsersList from '@/components/UsersList'
import { GuardedRoute } from '@/components/GuardedRoute'
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
import { renderErrorMessages } from '@/util'

interface Props extends RouteComponentProps {
  user: any
  searchUsers: any
  searchStudyRecords: any
}

class Explore extends React.Component<Props, {}> {
  // 検索入力後何ミリ秒後にディスパッチするか
  debounceMilliseconds: number = 500
  searchQueue: number | null = null

  // NOTE: /explore/studyrecords に直接アクセスが考えられるため、アクティブなタブを内部で記憶しない
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
    users: {
      currentPage: 1,
      perPage: 10
    },
    records: {
      currentPage: 1,
      perPage: 10
    }
  }
  state = {
    loading: false,
    onLoadUsersList: () => {},
    onLoadRecordsList: () => {},
    errorMessage: ''
  }

  componentDidMount() {
    this.useLoadingSpinner(this.initialize)
    this.setState({
      onLoadUsersList: this.loadUsersList,
      onLoadRecordsList: this.loadRecordsList
    })
  }

  useLoadingSpinner = async callback => {
    this.setState({ loading: true })
    await callback()
    this.setState({ loading: false })
  }

  initialize = async () => {
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
  }

  loadUsersList: (() => Promise<void>) | undefined = async () => {
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
      this.setState({ onLoadUsersList: undefined })
      this.users.currentPage--
    }
  }

  loadRecordsList: (() => Promise<void>) | undefined = async () => {
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
      this.setState({ onLoadRecordsList: undefined })
      this.records.currentPage--
    }
  }

  // TODO: dispatchのシュガーを一つにまとめる
  dispatchSearchUsers = async keyword => {
    try {
      await store.dispatch(
        searchUsers({
          keyword,
          page: this.search.users.currentPage,
          per: this.search.users.perPage
        })
      )
    } catch (e) {
      this.setState({ onLoadUsersList: undefined, errorMessage: e.message })
    }
  }

  dispatchSearchRecords = async keyword => {
    try {
      await store.dispatch(
        searchStudyRecords({
          keyword,
          page: this.search.records.currentPage,
          per: this.search.records.perPage
        })
      )
    } catch (e) {
      this.setState({ onLoadRecordsList: undefined })
      console.log(e, 'mock')
    }
  }

  setSearchQueue = (keyword, key) => {
    this.search[key].currentPage = 1
    const isUsersPage = this.isUsersPage()
    const onLoadListKey = isUsersPage ? 'onLoadUsersList' : 'onLoadRecordsList'
    const dispatch = isUsersPage
      ? 'dispatchSearchUsers'
      : 'dispatchSearchRecords'
    const clearState = isUsersPage
      ? clearUsersStateData
      : clearStudyRecordsStateData

    this.setState({
      [onLoadListKey]: () => {
        this.search[key].currentPage++
        this[dispatch](keyword).catch(() => this.search[key].currentPage--)
      },
      errorMessage: ''
    })
    this.searchQueue = window.setTimeout(() => {
      this.useLoadingSpinner(async () => {
        store.dispatch(clearState())
        await this[dispatch](keyword)
      })
    }, this.debounceMilliseconds)
  }

  onChange = async ({ nativeEvent }) => {
    const keyword = nativeEvent.target.value

    if (this.searchQueue) {
      clearTimeout(this.searchQueue)
      this.searchQueue = null
    }

    if (this.isUsersPage()) {
      this.setSearchQueue(keyword, 'users')
    } else {
      this.setSearchQueue(keyword, 'records')
    }
  }

  render() {
    const { match } = this.props
    const {
      onLoadRecordsList,
      onLoadUsersList,
      loading,
      errorMessage
    } = this.state
    const userTabClassName = classNames({
      'tab__list-item': !this.isUsersPage(),
      'tab__list-item--active': this.isUsersPage()
    })
    const recordTabClassName = classNames({
      'tab__list-item': !this.isRecordsPage(),
      'tab__list-item--active': this.isRecordsPage()
    })

    const callback = () => {
      this.state.errorMessage = ''
    }

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
          {renderErrorMessages([errorMessage])}
          {loading && '読み込み中MOCK'}
          {!loading && (
            <Switch>
              <GuardedRoute path={`${match.url}/users`} beforeEnter={callback}>
                <UsersList></UsersList>
                <Waypoint
                  onEnter={onLoadUsersList}
                  bottomOffset="-200px"
                ></Waypoint>
                {loading && '読み込み中MOCK'}
              </GuardedRoute>
              <GuardedRoute
                path={`${match.url}/studyrecords`}
                beforeEnter={callback}
              >
                <RecordsList></RecordsList>
                <Waypoint
                  onEnter={onLoadRecordsList}
                  bottomOffset="-200px"
                ></Waypoint>
                {loading && '読み込み中MOCK'}
              </GuardedRoute>
            </Switch>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user
})

export default connect(mapStateToProps, null)(Explore)
