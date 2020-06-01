import React from 'react'
import Modal from '@/components/Modal'
import RecordForm from '@/components/RecordForm'
import MaterialForm from '@/components/MaterialForm'
import MaterialCard from '@/components/MaterialCard'
import { readTeachingMaterial } from '@/actions/teachingMaterials'
import store from '@/store'
import { connect } from 'react-redux'
import LoadSpinner from '@/components/LoadSpinner'
import { RouteComponentProps } from 'react-router-dom'

interface Props extends RouteComponentProps {
  teachingMaterials: any
  user: any
}

class Record extends React.Component<Props, {}> {
  state = {
    isLoading: true
  }

  async componentDidMount() {
    if (this.props.user.isLogin) {
      const { loaded } = this.props.teachingMaterials
      if (!loaded) {
        await store.dispatch(readTeachingMaterial(store.getState().user.id))
      }
      this.setState({ isLoading: false })
    } else {
      this.props.history.push('/')
    }
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
            openButtonText="勉強を記録する"
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
          <LoadSpinner active={isLoading}></LoadSpinner>
          {!isLoading && (
            <ul className="material-list">
              {!materials.length && (
                <div className="not-found">まだ教材が登録されていません</div>
              )}
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
  teachingMaterials: state.teachingMaterials,
  user: state.user
})

export default connect(mapStateToProps, null)(Record)
