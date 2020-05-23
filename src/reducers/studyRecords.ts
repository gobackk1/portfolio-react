import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  readStudyRecords,
  postStudyRecord,
  getStudyRecord,
  putStudyRecord,
  deleteStudyRecord,
  postComment,
  deleteComment,
  searchStudyRecords,
  resetSearchStudyRecordsState,
  resetStudyRecordsState
} from '@/actions/studyRecords'
import _ from 'lodash'
import store from '@/store'

const dispatchReadStudyRecords: (per: number) => Promise<void> = async per => {
  try {
    await store.dispatch(
      readStudyRecords({
        page: store.getState().studyRecords.currentPage,
        per
      })
    )
  } catch (e) {
    console.log(e, 'mock')
  }
}

const dispatchSearchStudyRecords = async (keyword: string, per: number) => {
  try {
    await store.dispatch(
      searchStudyRecords({
        keyword,
        page: store.getState().studyRecords.search.currentPage,
        per
      })
    )
  } catch (e) {
    console.log(e, 'mock')
  }
}

const initialState: any = {
  isLoading: false,
  init: false,
  currentPage: 1,
  perPage: 10,
  search: {
    init: false,
    currentPage: 1,
    perPage: 10,
    keyword: ''
  },
  errorMessage: '',
  records: [
    {
      id: 1,
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
  onLoadStudyRecords: undefined,
  dispatchReadStudyRecords,
  dispatchSearchStudyRecords
}

export default reducerWithInitialState(initialState)
  .cases(
    [readStudyRecords.async.started, searchStudyRecords.async.started],
    state => {
      state.isLoading = true
      return { ...state }
    }
  )
  .cases(
    [readStudyRecords.async.failed, searchStudyRecords.async.failed],
    (state, { error }) => {
      state.isLoading = false
      if (error.type === 'record_not_found') state.errorMessage = error.message
      state.onLoadStudyRecords = undefined
      return { ...state }
    }
  )
  .case(readStudyRecords.async.done, (state, { result }) => {
    if (!state.init) {
      state.records = []
      state.init = true
      state.onLoadStudyRecords = () => {
        dispatchReadStudyRecords(state.perPage)
      }
    }
    state.isLoading = false
    state.currentPage++
    state.records = state.records.concat(result.data.result)
    state.loaded = true
    return {
      ...state
    }
  })
  .case(searchStudyRecords.async.done, (state, { params, result }) => {
    if (!state.search.init) {
      state.records = []
      state.search.init = true
      state.onLoadStudyRecords = () => {
        dispatchSearchStudyRecords(params.keyword, params.per)
      }
    }
    state.search.currentPage++
    state.search.keyword = params.keyword
    state.records = state.records.concat(result.data.result)
    state.loaded = true
    console.log(state, 'searchStudyRecords.async.done')
    return { ...state }
  })
  .cases(
    [getStudyRecord.async.done, putStudyRecord.async.done],
    (state, { result }) => {
      const data = result.data
      const index = state.records.findIndex(r => r.id === data.id)
      if (index !== -1) {
        state.records[index] = data
      } else {
        state.records.push(data)
      }

      console.log(state, 'getStudyRecord or putStudyRecord')
      return { ...state }
    }
  )
  .case(postStudyRecord.async.done, (state, { result }) => {
    const data = result.data
    state.records.unshift(data)

    return { ...state }
  })
  .case(deleteStudyRecord.async.done, (state, { result }) => {
    const id = result.data
    const index = state.records.findIndex(r => r.id === id)
    state.records.splice(index, 1)

    console.log(state, 'deleteStudyRecord')
    return {
      ...state
    }
  })
  .case(postComment.async.done, (state, { result }) => {
    const study_record_id = result.data.comment.study_record_id
    const data = result.data
    const index = state.records.findIndex(r => r.id === study_record_id)
    state.records[index].comments.push(data)

    console.log(state, 'postComment')
    return { ...state }
  })
  .case(deleteComment.async.done, (state, { result }) => {
    const { id, study_record_id } = result.data
    const rindex = state.records.findIndex(r => r.id === study_record_id)
    const { comments } = state.records[rindex]
    const cindex = comments.findIndex(c => c.id === id)
    comments.splice(cindex, 1)

    console.log(state, 'deleteComment')
    return { ...state }
  })
  .case(resetStudyRecordsState, state => {
    state.init = false
    state.currentPage = 1
    state.records = []
    state.errorMessage = ''
    return { ...state }
  })
  .case(resetSearchStudyRecordsState, state => {
    state.search.init = false
    state.search.currentPage = 1
    state.records = []
    state.errorMessage = ''
    state.search.keyword = ''
    return { ...state }
  })
