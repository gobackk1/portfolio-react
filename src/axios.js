import axios from 'axios'
import { Service } from 'axios-middleware'
import store from '@/store'

const service = new Service(axios)

service.register({
  onRequest(config) {
    if (config.auth === true) {
      config.headers['Authorization'] = `Bearer ${store.getState().user.token}`
      delete config.auth
    }
    if (typeof config.auth === 'string') {
      config.headers['Authorization'] = `Bearer ${config.auth}`
      delete config.auth
    }

    return config
  }
})

export default axios
