import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  getProfile,
  updateProfile,
  readProfileStudyRecords,
  setUserProfileState
} from '@/actions/userProfile'

const initialState: any = {
  data: {
    user: {
      id: 0,
      name: '',
      user_bio: '',
      image_url: '/images/user_images/default.png.png'
    },
    records: [
      {
        user: {
          name: '',
          image_url: '/images/user_images/default.png'
        },
        date: '01/01',
        record: {
          user_id: 0,
          comment: '',
          teaching_material: '',
          study_hours: 0,
          study_record_comments: []
        },
        comments: []
      }
    ],
    total_study_hours: 0,
    followings_count: 0,
    followers_count: 0,
    is_following: false,
    registered_date: ''
  },
  onLoadStudyRecords: () => {
    console.log('test')
  }
}

export default reducerWithInitialState(initialState)
  .case(getProfile.async.done, (state, done) => {
    console.log(done.result, 'getProfile.async.done')
    return { ...state, data: done.result.data }
  })
  .case(updateProfile.async.done, (state, done) => {
    console.log(done.result.data, 'updateProfile.async.done')
    return {
      ...state,
      user: {
        ...state.user,
        user_bio: done.result.data.user.user_bio
      }
    }
  })
  .case(readProfileStudyRecords.async.done, (state, { result }) => {
    state.records = state.records.concat(result.data)
    return { ...state }
  })
  .case(setUserProfileState, (state, { followers_count }) => {
    if (followers_count != null) state.data.followers_count = followers_count
    return { ...state }
  })
