import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import store from '@/store'
import Explore from '@/view/Explore'
import AppHeader from '@/components/AppHeader'
import Record from '@/view/Record'
import UserShow from '@/view/UserShow'
import RecordShow from '@/view/RecordShow'

// 開発用ログインスキップ
import { login } from '@/actions/user'
import RecordEdit from './view/RecordEdit'
store.dispatch(login({ email: 'example@test.com', password: 'foobar' }))

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppHeader></AppHeader>

      <Switch>
        <Route path="/explore" component={Explore}></Route>
        <Route path="/users/:id" component={UserShow}></Route>
        <Route path="/record/:id/edit" component={RecordEdit}></Route>
        <Route path="/record/:id" component={RecordShow}></Route>
        <Route path="/record" component={Record}></Route>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
