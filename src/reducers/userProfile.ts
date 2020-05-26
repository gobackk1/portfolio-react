import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  readProfileStudyRecords,
  setUserProfileState
} from '@/actions/userProfile'
import store from '@/store'

const dispatchReadProfileStudyRecords = async (per: number) => {
  const state = store.getState().userProfile
  try {
    await store.dispatch(
      readProfileStudyRecords({
        id: state.userId,
        page: state.currentPage,
        per
      })
    )
  } catch (e) {
    console.log('mock', e)
  }
}

const initialState: any = {
  userId: 0,
  isLoading: false,
  records: [],
  currentPage: 1,
  onLoadStudyRecords: () => {
    dispatchReadProfileStudyRecords(10)
  }
}

export default reducerWithInitialState(initialState)
  .case(readProfileStudyRecords.async.started, (state, { initialize, id }) => {
    if (initialize) {
      state.currentPage = 1
      state.records = []
      state.userId = id
    }
    state.isLoading = true
    return { ...state }
  })
  .case(readProfileStudyRecords.async.failed, (state, { error }) => {
    state.isLoading = false
    state.onLoadStudyRecords = undefined
    return { ...state }
  })
  .case(readProfileStudyRecords.async.done, (state, { result }) => {
    state.isLoading = false
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
