import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import store from '@/store'
import { logout } from '@/actions/user'
import Modal from '@/components/Modal'
import LoginForm from '@/components/LoginForm'
import RenderIfLogin from '@/components/RenderIfLogin'
import RenderIfLogout from '@/components/RenderIfLogout'

interface Props {
  user: any
}

class AppHeader extends React.Component<Props, { isLogin: boolean }> {
  static defaultProps: any = {}
  componentDidMount() {
    this.setState({
      isLogin: store.getState().user.isLogin
    })
    console.log(store.getState().user.isLogin, 'islogin')
  }
  onClickLogout() {
    store.dispatch(logout())
    console.log(store.getState().user.isLogin, 'islogin')
  }

  render() {
    return (
      <header>
        <Link to="/">アプリ名</Link>
        <nav>
          <ul>
            <RenderIfLogin>
              <li>
                <Link to="/explore">探す</Link>
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
            </RenderIfLogin>
            <RenderIfLogout>
              <li>
                <Modal openButtonText="ログイン">
                  <LoginForm></LoginForm>
                </Modal>
              </li>
            </RenderIfLogout>
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
