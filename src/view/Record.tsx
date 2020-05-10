import React from 'react'
import Modal from '@/components/Modal'
import RecordForm from '@/components/RecordForm'
import MaterialForm from '@/components/MaterialForm'
import { readTeachingMaterial } from '@/actions/teachingMaterials'
import store from '@/store'
import { connect } from 'react-redux'

interface Props {
  teachingMaterials: any
}

class Record extends React.Component<Props, {}> {
  componentDidMount() {
    store.dispatch(readTeachingMaterial(store.getState().user.id))
  }
  render() {
    const { materials } = this.props.teachingMaterials
    return (
      <>
        <Modal openButtonText="教材なしで記録する" buttonClassName="mock">
          <RecordForm type="post"></RecordForm>
        </Modal>
        <Modal openButtonText="新しい教材を登録する" buttonClassName="mock">
          <MaterialForm></MaterialForm>
        </Modal>
        {materials.map(({ title }, i) => (
          <div key={i}>{title}</div>
        ))}
      </>
    )
  }
}

const mapStateToProps = state => ({
  teachingMaterials: state.teachingMaterials
})

export default connect(mapStateToProps, null)(Record)
