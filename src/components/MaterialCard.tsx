import React from 'react'
import { SlideDown } from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import Modal from '@/components/Modal'
import RecordForm from '@/components/RecordForm'
import MaterialForm from '@/components/MaterialForm'
import MaterialImage from '@/components/MaterialImage'
import store from '@/store'
import { deleteTeachingMaterial } from '@/actions/teachingMaterials'
import { connect } from 'react-redux'
import { deleteStudyRecordByTeachingMaterialId } from '@/actions/studyRecords'

const Dropdown: React.SFC<{ open: boolean }> = props => (
  <SlideDown
    className={'my-dropdown-slidedown'}
    style={{
      position: 'absolute',
      right: 0
    }}
  >
    {props.open ? props.children : null}
  </SlideDown>
)

interface Props {
  material: any
  user?: any
}

class MaterialCard extends React.Component<Props> {
  state = {
    isOpen: false
  }

  onClickDelete = async (userId: number, id: number) => {
    if (
      window.confirm(
        '本当に教材を削除しますか？\nこの教材で記録した勉強記録も合わせて削除されます。'
      )
    ) {
      const res = await store.dispatch(deleteTeachingMaterial({ userId, id }))
      store.dispatch(deleteStudyRecordByTeachingMaterialId(res.data))
    }
  }

  onClickEllipsis = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation()
    if (!(e.nativeEvent.target instanceof Element)) return
    const className = e.nativeEvent.target.className
    if (className.indexOf('card-material') === -1) return
    this.setState({ isOpen: !this.state.isOpen })
  }

  onClickCard = ({ nativeEvent }, id) => {
    const recordButton = document.getElementById(`material-${id}`)
    ;(recordButton!.children[0] as HTMLInputElement).click()
  }

  render() {
    const {
      material,
      material: { title, id },
      user
    } = this.props
    return (
      <>
        <div
          className="card-material"
          onClick={e => {
            this.onClickCard(e, id)
          }}
        >
          <div className="card-material__head">
            <MaterialImage
              bgUrl={`url(${process.env.REACT_APP_API_URL}${this.props.material.image_url}) no-repeat center/contain`}
              height={150}
            ></MaterialImage>
          </div>
          <div className="card-material__foot">
            <div>{title}</div>
            <div
              className="card-material__ellipsis fa-icon-ellipsis"
              onClick={e => {
                this.onClickEllipsis(e)
              }}
            >
              <div className="card-material__dropdown">
                <Dropdown open={this.state.isOpen}>
                  <Modal
                    openButtonText="編集"
                    buttonClassName="card-material__dropdown-button"
                  >
                    <MaterialForm
                      type="edit"
                      material={material}
                    ></MaterialForm>
                  </Modal>
                  <button
                    onClick={() => this.onClickDelete(user.id, id)}
                    type="button"
                    className="card-material__dropdown-button clr-danger"
                  >
                    削除
                  </button>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
        <div className="card-material__hidden" id={`material-${id}`}>
          <Modal
            openButtonText="記録する"
            buttonClassName="card-material__dropdown-button"
          >
            <RecordForm type="post" material={material}></RecordForm>
          </Modal>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps, null)(MaterialCard)
