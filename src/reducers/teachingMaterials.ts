import { reducerWithInitialState } from 'typescript-fsa-reducers'
import {
  postTeachingMaterial,
  deleteTeachingMaterial,
  readTeachingMaterial
} from '@/actions/teachingMaterials'

const initialState = {
  loaded: false,
  materials: [
    {
      id: 0,
      user_id: 0,
      title: ''
    }
  ]
}

export default reducerWithInitialState(initialState)
  .case(readTeachingMaterial.async.done, (state, { result: { data } }: any) => {
    console.log(data, 'readTeachingMaterial.async.done')
    return {
      loaded: true,
      materials: [...data]
    }
  })
  .case(postTeachingMaterial.async.done, (state, { result }) => {
    console.log(result, 'postTeachingMaterial.async.done')
    state.materials.push(result.data)
    return {
      ...state,
      materials: [...state.materials]
    }
  })
  .case(deleteTeachingMaterial.async.done, (state, { result }) => {
    console.log(result, 'deleteTeachingMaterial.async.done')
    const id = result.data
    const index = state.materials.findIndex(m => m.id === id)
    state.materials.splice(index, 1)
    return {
      ...state
    }
  })
