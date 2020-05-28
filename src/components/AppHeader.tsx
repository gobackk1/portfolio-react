import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import store from '@/store'
import { logout } from '@/actions/user'
import Modal from '@/components/Modal'
import LoginForm from '@/components/LoginForm'
import Render from '@/components/Render'
import classNames from 'classnames'

interface Props extends RouteComponentProps {
  user?: any
}

class AppHeader extends React.Component<Props, { isLogin: boolean }> {
  static defaultProps: any = {}

  componentDidMount() {
    this.setState({
      isLogin: store.getState().user.isLogin
    })
  }

  onClickLogout = () => {
    // if (window.confirm('本当にログアウトしますか？')) {
    store.dispatch(logout())
    //   this.props.history.push('/')
    // }
  }

  menuListClassName = (className: string): any => {
    const { pathname } = this.props.location
    const regexp = new RegExp(className)
    return classNames({
      'menu-list__item': !regexp.test(pathname),
      'menu-list__item--active': regexp.test(pathname)
    })
  }

  render() {
    const { token } = this.props.user
    return (
      <header className="app-header">
        <Link to="/" className="app-header__title">
          勉強時間記録アプリ
        </Link>
        <nav>
          <ul className="app-header__menu menu-list">
            <Render if={token}>
              <li className={this.menuListClassName('/explore')}>
                <Link to="/explore/users">探す</Link>
              </li>
              <li className={this.menuListClassName('/record')}>
                <Link to="/record">記録する</Link>
              </li>
              <li className={this.menuListClassName('/report')}>
                <Link to="/report">レポート</Link>
              </li>
              <li className={this.menuListClassName('/profile')}>
                <Link to="/profile">プロフィール</Link>
              </li>
              <li className="menu-list__item">
                <button onClick={this.onClickLogout} type="button">
                  ログアウト
                </button>
              </li>
            </Render>
            <Render if={!token}>
              <li className="menu-list__login">
                <Modal openButtonText="ログイン" buttonClassName="button-login">
                  <LoginForm></LoginForm>
                </Modal>
              </li>
            </Render>
          </ul>
        </nav>
      </header>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user
})

export default connect(mapStateToProps, null)(withRouter(AppHeader))
