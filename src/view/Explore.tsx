import React from 'react'
import { connect } from 'react-redux'
import { resetUsersState, resetSearchUsersState } from '@/actions/users'
import {
  resetSearchStudyRecordsState,
  resetStudyRecordsState
} from '@/actions/studyRecords'
import UsersList from '@/components/UsersList'
import classNames from 'classnames'
import store from '@/store'
import { Waypoint } from 'react-waypoint'

import { Link, Switch, Route, RouteComponentProps } from 'react-router-dom'
import RecordsList from '@/components/RecordsList'
import { renderErrorMessages } from '@/utils/render'

interface Props extends RouteComponentProps {
  user: any
  users: any
  studyRecords: any
  searchUsers: any
  searchStudyRecords: any
}

class Explore extends React.Component<Props, {}> {
  // 検索入力後何ミリ秒後にディスパッチするか
  debounceMilliseconds: number = 500
  searchQueue: number | null = null
  usersSearchInput!: HTMLInputElement | null
  studyRecordsSearchInput!: HTMLInputElement | null

  // NOTE: /explore/studyrecords に直接アクセスが考えられるため、アクティブなタブを内部で記憶しない
  isUsersPage: () => boolean = () => /users/.test(window.location.pathname)
  isRecordsPage: () => boolean = () =>
    /studyrecords/.test(window.location.pathname)

  state = {
    loading: false
  }

  componentDidMount() {
    this.usersSearchInput = document.getElementById(
      'explore-users-search'
    ) as HTMLInputElement
    this.studyRecordsSearchInput = document.getElementById(
      'explore-records-search'
    ) as HTMLInputElement
    this.useLoadingSpinner(this.initialize)
  }

  useLoadingSpinner = async callback => {
    this.setState({ loading: true })
    await callback()
    this.setState({ loading: false })
  }

  initialize = async () => {
    if (this.usersSearchInput!.value === '') {
      this.usersSearchInput!.value = this.props.users.search.keyword
    }
    if (this.studyRecordsSearchInput!.value === '') {
      this.studyRecordsSearchInput!.value = this.props.studyRecords.search.keyword
    }
    if (!this.props.users.init) {
      try {
        await this.props.users.dispatchReadUsers(10)
      } catch (e) {
        console.log(e)
      }
    }
    if (!this.props.studyRecords.init) {
      try {
        await this.props.studyRecords.dispatchReadStudyRecords(10)
      } catch (e) {
        console.log(e)
      }
    }
  }

  dispatchReadUsers: () => Promise<void> = async () => {
    store.dispatch(resetUsersState())
    await this.props.users.dispatchReadUsers(10)
  }

  dispatchSearchUsers: (
    keyword: string
  ) => () => Promise<void> = keyword => async () => {
    store.dispatch(resetSearchUsersState())
    await this.props.users.dispatchSearchUsers(keyword, 10)
  }

  dispatchReadStudyRecords: () => Promise<void> = async () => {
    store.dispatch(resetStudyRecordsState())
    this.props.studyRecords.dispatchReadStudyRecords(10)
  }

  dispatchSearchStudyRecords: (
    keyword: string
  ) => () => Promise<void> = keyword => async () => {
    store.dispatch(resetSearchStudyRecordsState())
    await this.props.studyRecords.dispatchSearchStudyRecords(keyword, 10)
  }

  setSearchQueue = (keyword: string, page: string): void => {
    const {
      dispatchReadUsers,
      dispatchSearchUsers,
      dispatchReadStudyRecords,
      dispatchSearchStudyRecords
    } = this
    const callback =
      page === 'user'
        ? keyword
          ? dispatchSearchUsers(keyword)
          : dispatchReadUsers
        : keyword
        ? dispatchSearchStudyRecords(keyword)
        : dispatchReadStudyRecords

    this.searchQueue = window.setTimeout(() => {
      this.useLoadingSpinner(callback)
    }, this.debounceMilliseconds)
  }

  onChange = async ({ nativeEvent }) => {
    const keyword = nativeEvent.target.value

    if (this.searchQueue) {
      clearTimeout(this.searchQueue)
      this.searchQueue = null
    }

    if (this.isUsersPage()) {
      this.setSearchQueue(keyword, 'user')
    } else {
      this.setSearchQueue(keyword, 'studyRecords')
    }
  }

  beforeEnter = async () => {
    if (!this.props.users.data.length) {
      this.usersSearchInput!.value = ''
      await this.dispatchReadUsers()
    }
    if (!this.props.studyRecords.records.length) {
      this.studyRecordsSearchInput!.value = ''
      await this.dispatchReadStudyRecords()
    }
  }

  render() {
    const {
      match,
      users,
      studyRecords,
      users: { onLoadUsers },
      studyRecords: { onLoadStudyRecords }
    } = this.props
    const { loading } = this.state
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
          <Link
            to={`${match.url}/users`}
            className={userTabClassName}
            onClick={this.beforeEnter}
          >
            ユーザー
          </Link>
          <Link
            to={`${match.url}/studyrecords`}
            className={recordTabClassName}
            onClick={this.beforeEnter}
          >
            勉強記録
          </Link>
        </div>
        <div className="search">
          <input
            type="text"
            onChange={this.onChange}
            className="search__input"
            placeholder="検索"
            style={{ display: this.isUsersPage() ? '' : 'none' }}
            id="explore-users-search"
          />
          <input
            type="text"
            onChange={this.onChange}
            className="search__input"
            placeholder="検索"
            style={{ display: this.isRecordsPage() ? '' : 'none' }}
            id="explore-records-search"
          />
        </div>
        <div className="tab__body">
          {renderErrorMessages([users.errorMessage])}
          {renderErrorMessages([studyRecords.errorMessage])}
          {loading && '読み込み中MOCK'}
          {!loading && (
            <Switch>
              <Route path={`${match.url}/users`}>
                <UsersList></UsersList>
                {/* {loading && '読み込み中MOCK'} */}
              </Route>
              <Route path={`${match.url}/studyrecords`}>
                <RecordsList></RecordsList>
              </Route>
            </Switch>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user,
  users: state.users,
  studyRecords: state.studyRecords
})

export default connect(mapStateToProps, null)(Explore)
