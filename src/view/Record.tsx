import React from 'react'
import Modal from '@/components/Modal'
import RecordForm from '@/components/RecordForm'
import MaterialForm from '@/components/MaterialForm'
import MaterialCard from '@/components/MaterialCard'
import {
  readTeachingMaterial,
  deleteTeachingMaterial
} from '@/actions/teachingMaterials'
import store from '@/store'
import { connect } from 'react-redux'

interface Props {
  teachingMaterials: any
  user: any
}

class Record extends React.Component<Props, {}> {
  componentDidMount() {
    store.dispatch(readTeachingMaterial(store.getState().user.id))
  }

  onClickRecord = () => {}

  render() {
    const {
      teachingMaterials: { materials },
      user
    } = this.props
    return (
      <div className="l-inner">
        <Modal
          openButtonText="記録する"
          buttonClassName="button-record fa-icon-pen mr30 mb30"
        >
          <RecordForm type="post"></RecordForm>
        </Modal>
        <Modal
          openButtonText="教材を登録する"
          buttonClassName="button-material fa-icon-book"
        >
          <MaterialForm type="post"></MaterialForm>
        </Modal>
        <h2 className="title-l mb20">教材一覧</h2>
        <ul className="material-list">
          {materials.map((material, i) => {
            return (
              <li key={i} className="material-list__item">
                <MaterialCard material={material}></MaterialCard>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  teachingMaterials: state.teachingMaterials,
  user: state.user
})

export default connect(mapStateToProps, null)(Record)
