import React from 'react'
import Modal from '@/components/Modal'
import RecordForm from '@/components/RecordForm'
import MaterialForm from '@/components/MaterialForm'
import MaterialCard from '@/components/MaterialCard'
import { readTeachingMaterial } from '@/actions/teachingMaterials'
import store from '@/store'
import { connect } from 'react-redux'
import DotSpinner from '@/components/DotSpinner'

interface Props {
  teachingMaterials: any
}

class Record extends React.Component<Props, {}> {
  state = {
    isLoading: true
  }

  async componentDidMount() {
    const { loaded } = this.props.teachingMaterials
    if (!loaded) {
      await store.dispatch(readTeachingMaterial(store.getState().user.id))
    }
    this.setState({ isLoading: false })
  }

  render() {
    const {
      teachingMaterials: { materials }
    } = this.props
    const { isLoading } = this.state

    return (
      <>
        <div className="l-inner">
          <Modal
            openButtonText="記録する"
            buttonClassName="button-record--large fa-icon-pen mr30 mb30"
          >
            <RecordForm type="post"></RecordForm>
          </Modal>
          <Modal
            openButtonText="教材を登録する"
            buttonClassName="button-material--large fa-icon-book"
          >
            <MaterialForm type="post"></MaterialForm>
          </Modal>
          <h3 className="title-m mb20">教材一覧</h3>
          {isLoading && (
            <div className="tac">
              <DotSpinner></DotSpinner>
            </div>
          )}
          {!isLoading && (
            <ul className="material-list">
              {materials.map((material, i) => (
                <li key={i} className="material-list__item">
                  <MaterialCard material={material}></MaterialCard>
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({
  teachingMaterials: state.teachingMaterials
})

export default connect(mapStateToProps, null)(Record)
