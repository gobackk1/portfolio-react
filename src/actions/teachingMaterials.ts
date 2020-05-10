import { asyncActionCreator } from '@/actions'
import axios, { auth } from '@/axios'

const materialUrl = userId =>
  `${process.env.REACT_APP_API_URL}/users/${userId}/teaching_materials`

export const postTeachingMaterial = asyncActionCreator<any, any, Error>(
  'POST_TEACHING_MATERIAL',
  async ({ title, userId }) => {
    const res = await axios.post(`${materialUrl(userId)}`, { title }, auth)
    console.log(res.data, 'POST_TEACHING_MATERIAL')
    return res
  }
)

export const deleteTeachingMaterial = asyncActionCreator<any, any, Error>(
  'DELETE_TEACHING_MATERIAL',
  async ({ id, userId }) =>
    await axios.delete(`${materialUrl(userId)}/${id}`, auth)
)

export const readTeachingMaterial = asyncActionCreator<any, any, Error>(
  'READ_TEACHING_MATERIAL',
  async userId => {
    const res = await axios.get(`${materialUrl(userId)}`, auth)
    console.log(res.data, 'READ_TEACHING_MATERIAL')
    return res
  }
)
