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
  resetStudyRecordsState,
  setStudyRecordsState,
  updateTeachingMaterialInStudyRecord,
  deleteStudyRecordByTeachingMaterialId
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

const dispatchSearchStudyRecords = async (
  keyword: string | undefined,
  per: number
) => {
  try {
    if (!keyword) return
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
      date: '01/01',
      user_id: 0,
      comment: '',
      teaching_material_name: '',
      teaching_material_id: 0,
      study_hours: 0,
      study_record_comments: [],
      comments: [],
      user: {
        id: 0,
        name: '',
        image_url: '/images/user_images/default.png'
      }
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
      if (!state.init) {
        state.records = []
        state.init = true
        state.onLoadStudyRecords = () => {
          dispatchReadStudyRecords(state.perPage)
        }
      }
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
    state.isLoading = false
    state.currentPage++
    state.records = state.records.concat(result.records)
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
    state.records = state.records.concat(result.records)
    state.loaded = true
    console.log(state, 'searchStudyRecords.async.done')
    return { ...state }
  })
  .cases(
    [getStudyRecord.async.done, putStudyRecord.async.done],
    (state, { result }) => {
      const index = state.records.findIndex(r => r.id === result.id)
      if (index !== -1) {
        state.records[index] = result
      } else {
        state.records.push(result)
      }

      console.log(state, 'getStudyRecord or putStudyRecord')
      return { ...state }
    }
  )
  .case(postStudyRecord.async.done, (state, { result }) => {
    state.records.unshift(result)
    return { ...state }
  })
  .case(deleteStudyRecord.async.done, (state, { result }) => {
    const index = state.records.findIndex(r => r.id === result)
    state.records.splice(index, 1)

    console.log(state, 'deleteStudyRecord')
    return { ...state }
  })
  .case(postComment.async.done, (state, { result }) => {
    const study_record_id = result.study_record_id
    const index = state.records.findIndex(r => r.id === study_record_id)
    state.records[index].comments.push(result)

    console.log(state, 'postComment')
    return { ...state }
  })
  .case(deleteComment.async.done, (state, { result }) => {
    const { id, study_record_id } = result
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
  .case(setStudyRecordsState, (state, { errorMessage }) => {
    if (errorMessage != null) state.errorMessage = errorMessage
    return { ...state }
  })
  .case(updateTeachingMaterialInStudyRecord, (state, params) => {
    const { id, title, image_url } = params
    const result = state.records.map(r => {
      if (r.teaching_material_id === id) {
        r.teaching_material_name = title
        r.image_url = image_url
      }
      return r
    })
    state.records = result
    console.log(state, 'updateTeachingMaterialInStudyRecord')
    return { ...state }
  })
  .case(deleteStudyRecordByTeachingMaterialId, (state, id) => {
    const result = state.records.filter(r => r.teaching_material_id !== id)
    state.records = result
    console.log('deleteStudyRecordByTeachingMaterialId', state)
    return { ...state }
  })
