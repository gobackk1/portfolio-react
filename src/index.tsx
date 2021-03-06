import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import store from '@/store'
import Explore from '@/view/Explore'
import AppHeader from '@/components/AppHeader'
import Record from '@/view/Record'
import RecordShow from '@/view/RecordShow'
import Profile from '@/view/Profile'
import Report from '@/view/Report'
import Home from '@/view/Home'

import { login } from '@/actions/user'
import RecordEdit from './view/RecordEdit'
;(async () => {
  // 開発用ログインスキップ
  await store.dispatch(login({ email: 'auth@example.com', password: 'foobar' }))

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <AppHeader></AppHeader>
        <div className="l-container">
          <Switch>
            <Route path="/explore" component={Explore}></Route>
            <Route path="/record/:id/edit" component={RecordEdit}></Route>
            <Route path="/record/:id" component={RecordShow}></Route>
            <Route path="/record" component={Record}></Route>
            <Route path="/profile/:id" component={Profile}></Route>
            <Route path="/profile" component={Profile}></Route>
            <Route path="/report" component={Report}></Route>
            <Route path="/" component={Home}></Route>
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  )

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister()
})()
