import React from 'react'
import Modal from '@/components/Modal'
import RecordForm from '@/components/RecordForm'
import MaterialForm from '@/components/MaterialForm'
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

  onClickDelete = (userId: number, id: number) => {
    store.dispatch(deleteTeachingMaterial({ userId, id }))
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
        {materials.map((material, i) => {
          const { title, id } = material
          return (
            <div key={i} className="mt30">
              <img
                src={`${process.env.REACT_APP_API_URL}${material.image_url}`}
                width="80"
                height="80"
                alt="教材のデフォルト画像"
              />
              <div>{title}</div>
              <button
                onClick={() => this.onClickDelete(user.id, id)}
                type="button"
                className="mock"
              >
                削除
              </button>
              <Modal openButtonText="記録する" buttonClassName="mock">
                <RecordForm type="post" material={material}></RecordForm>
              </Modal>
              <Modal openButtonText="更新する" buttonClassName="mock">
                <MaterialForm type="edit" material={material}></MaterialForm>
              </Modal>
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  teachingMaterials: state.teachingMaterials,
  user: state.user
})

export default connect(mapStateToProps, null)(Record)
