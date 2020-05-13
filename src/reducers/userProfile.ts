import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { initProfile, updateProfile } from '@/actions/userProfile'

const initialState: any = {
  user: {
    id: 0,
    name: '',
    user_bio: '',
    image_url: '/images/user_images/default.png.png'
  },
  study_records: [{ comment: '', teaching_material: '', study_hours: 0 }],
  total_study_hours: 0
}

export default reducerWithInitialState(initialState)
  .case(initProfile.async.done, (state, done) => {
    return {
      ...done.result.data
    }
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
