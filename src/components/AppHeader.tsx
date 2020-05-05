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
      <header>
        <Link to="/">アプリ名</Link>
        <nav>
          <ul>
            <Render if={token}>
              <li>
                <Link to="/explore/users">探す</Link>
              </li>
              <li>
                <Link to="/record">記録する</Link>
              </li>
              <li>
                <Link to="/report">レポート</Link>
              </li>
              <li>
                <Link to="/profile">プロフィール</Link>
              </li>
              <li>
                <button onClick={this.onClickLogout} type="button">
                  ログアウト
                </button>
              </li>
            </Render>
            <Render if={!token}>
              <li>
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
