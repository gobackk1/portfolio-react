import { asyncActionCreator } from '@/actions'
import axios, { auth } from '@/axios'
import store from '@/store'

const usersUrl = `${process.env.REACT_APP_API_URL}/users`

export const postTeachingMaterial = asyncActionCreator<any, any, Error>(
  'POST_TEACHING_MATERIAL',
  async params => {
    const { user_id } = params
    const res = await axios.post(
      `${usersUrl}/${user_id}/teaching_materials`,
      params,
      auth
    )
    console.log(res.data, 'POST_TEACHING_MATERIAL')
    return res
  }
)

export const updateTeachingMaterial = asyncActionCreator<any, any, Error>(
  'UPDATE_TEACHING_MATERIAL',
  async params => {
    const { user_id, id } = params
    const res = await axios.put(
      `${usersUrl}/${user_id}/teaching_materials/${id}`,
      params,
      auth
    )
    console.log(res.data, 'UPDATE_TEACHING_MATERIAL')
    return res
  }
)

export const deleteTeachingMaterial = asyncActionCreator<any, any, Error>(
  'DELETE_TEACHING_MATERIAL',
  async ({ userId, id }) => {
    console.log(userId, id, 'DELETE_TEACHING_MATERIAL')
    return await axios.delete(
      `${usersUrl}/${userId}/teaching_materials/${id}`,
      auth
    )
  }
)

export const readTeachingMaterial = asyncActionCreator<any, any, Error>(
  'READ_TEACHING_MATERIAL',
  async userId => {
    const res = await axios.get(
      `${usersUrl}/${userId}/teaching_materials`,
      auth
    )
    console.log(res.data, 'READ_TEACHING_MATERIAL')
    return res
  }
)
