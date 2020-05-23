import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  getProfile,
  updateProfile,
  readProfileStudyRecords,
  setUserProfileState
} from '@/actions/userProfile'
import store from '@/store'

const dispatchReadProfileStudyRecords = async (per: number) => {
  const state = store.getState().userProfile
  try {
    await store.dispatch(
      readProfileStudyRecords({
        id: state.profile.user.id,
        page: state.currentPage,
        per
      })
    )
  } catch (e) {
    console.log('mock', e)
  }
}

const initialState: any = {
  profile: {
    user: {
      id: 0,
      name: '',
      user_bio: '',
      image_url: '/images/user_images/default.png.png'
    },
    total_study_hours: 0,
    followings_count: 0,
    followers_count: 0,
    is_following: false,
    registered_date: '',
    currentPage: 1
  },
  records: [
    // {
    //   user: {
    //     name: '',
    //     image_url: '/images/user_images/default.png'
    //   },
    //   date: '01/01',
    //   record: {
    //     user_id: 0,
    //     comment: '',
    //     teaching_material: '',
    //     study_hours: 0,
    //     study_record_comments: []
    //   },
    //   comments: []
    // }
  ],
  currentPage: 1,
  onLoadStudyRecords: () => {
    dispatchReadProfileStudyRecords(10)
  }
}

export default reducerWithInitialState(initialState)
  .case(getProfile.async.done, (state, done) => {
    console.log(done.result, 'getProfile.async.done')
    return { ...state, profile: done.result.data }
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
  .case(readProfileStudyRecords.async.failed, (state, { error }) => {
    state.onLoadStudyRecords = undefined
    return { ...state }
  })
  .case(readProfileStudyRecords.async.done, (state, { result }) => {
    state.currentPage++
    state.records = state.records.concat(result.result)
    return { ...state }
  })
  .case(
    setUserProfileState,
    (state, { followers_count, currentPage, records }) => {
      if (followers_count != null)
        state.profile.followers_count = followers_count
      if (currentPage != null) state.currentPage = currentPage
      if (records != null) state.records = records
      return { ...state }
    }
  )
