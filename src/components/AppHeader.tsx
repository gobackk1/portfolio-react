import React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import store from '@/store'
import { logout } from '@/actions/user'
import Modal from '@/components/Modal'
import LoginForm from '@/components/LoginForm'
import Render from '@/components/Render'

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
