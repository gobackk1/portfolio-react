import React from 'react'
import { connect } from 'react-redux'
import { resetUsersState, resetSearchUsersState } from '@/actions/users'
import {
  resetSearchStudyRecordsState,
  resetStudyRecordsState
} from '@/actions/studyRecords'
import UsersList from '@/components/UsersList'
import DotSpinner from '@/components/DotSpinner'
import RecordsList from '@/components/RecordsList'
import ErrorMessages from '@/components/ErrorMessages'
import classNames from 'classnames'
import store from '@/store'
import { Link, Switch, Route, RouteComponentProps } from 'react-router-dom'

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
    isLoading: false
  }

  componentDidMount() {
    if (this.props.user.isLogin) {
      this.usersSearchInput = document.getElementById(
        'explore-users-search'
      ) as HTMLInputElement
      this.studyRecordsSearchInput = document.getElementById(
        'explore-records-search'
      ) as HTMLInputElement
      this.useLoadingSpinner(this.initialize)
    } else {
      this.props.history.push('/')
    }
  }

  useLoadingSpinner = async callback => {
    this.setState({ isLoading: true })
    await callback()
    this.setState({ isLoading: false })
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

  beforeEnterUsers = () => {
    if (!this.props.users.data.length) {
      this.usersSearchInput!.value = ''
      this.useLoadingSpinner(this.dispatchReadUsers)
    }
  }

  beforeEnterStudyRecords = () => {
    if (!this.props.studyRecords.records.length) {
      this.studyRecordsSearchInput!.value = ''
      this.useLoadingSpinner(this.dispatchReadStudyRecords)
    }
  }

  render() {
    const {
      match,
      users,
      studyRecords,
      studyRecords: { records, onLoadStudyRecords, isLoading: isLoadingState }
    } = this.props
    const { isLoading } = this.state
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
            onClick={this.beforeEnterUsers}
          >
            ユーザー
          </Link>
          <Link
            to={`${match.url}/studyrecords`}
            className={recordTabClassName}
            onClick={this.beforeEnterStudyRecords}
          >
            勉強記録
          </Link>
          <div className="tab__list-search search">
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
        </div>
        <div className="tab__body">
          {isLoading && (
            <div className="tac">
              <DotSpinner></DotSpinner>
            </div>
          )}
          {!isLoading && (
            <Switch>
              <Route path={`${match.url}/users`}>
                <ErrorMessages messages={[users.errorMessage]}></ErrorMessages>
                <UsersList></UsersList>
              </Route>
              <Route path={`${match.url}/studyrecords`}>
                <ErrorMessages
                  messages={[studyRecords.errorMessage]}
                ></ErrorMessages>
                <RecordsList
                  data={records}
                  onLoadStudyRecords={onLoadStudyRecords}
                ></RecordsList>
                {isLoadingState && (
                  <div className="tac">
                    <DotSpinner></DotSpinner>
                  </div>
                )}
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
