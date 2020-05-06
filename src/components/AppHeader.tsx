import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import store from '@/store'
import { logout } from '@/actions/user'
import Modal from '@/components/Modal'
import LoginForm from '@/components/LoginForm'
import Render from '@/components/Render'

interface Props {
  user: any
}

class AppHeader extends React.Component<Props, { isLogin: boolean }> {
  static defaultProps: any = {}
  componentDidMount() {
    this.setState({
      isLogin: store.getState().user.isLogin
    })
  }
  onClickLogout() {
    store.dispatch(logout())
  }

  render() {
    const { token } = this.props.user
    return (
      <header className="app-header">
        <Link to="/" className="app-header__title">
          アプリ名
        </Link>
        <nav>
          <ul className="app-header__menu menu-list">
            <Render if={token}>
              <li className="menu-list__item">
                <Link to="/explore/users">探す</Link>
              </li>
              <li className="menu-list__item">
                <Link to="/record">記録する</Link>
              </li>
              <li className="menu-list__item">
                <Link to="/report">レポート</Link>
              </li>
              <li className="menu-list__item">
                <Link to="/profile">プロフィール</Link>
              </li>
              <li className="menu-list__item">
                <button
                  onClick={this.onClickLogout}
                  type="button"
                  className="menu-list__item"
                >
                  ログアウト
                </button>
              </li>
            </Render>
            <Render if={!token}>
              <li className="button-login">
                <Modal openButtonText="ログイン">
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

export default connect(mapStateToProps, null)(AppHeader)
