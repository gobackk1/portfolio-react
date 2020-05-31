import axios from 'axios'
import { Service } from 'axios-middleware'
import { getCookieValue } from '@/utils'

const service = new Service(axios)
service.register({
  onRequest(config) {
    if (config.auth === true) {
      config.headers['Authorization'] = `Bearer ${getCookieValue(
        '__study_record_app_token'
      )}`
      delete config.auth
    }
    if (typeof config.auth === 'string') {
      config.headers['Authorization'] = `Bearer ${config.auth}`
      delete config.auth
    }

    return config
  }
})

export const auth = {
  auth: true as any
}

export default axios
