import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import user from '@/reducers/user'
import studyRecords from '@/reducers/studyRecords'

export default combineReducers({ user, studyRecords, form })
