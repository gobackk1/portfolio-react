import React from 'react'
import Modal from 'react-modal'
import store from '@/store'
import { clearError } from '@/actions/user'

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

interface Props {
  openButtonText: string
  buttonClassName: string
}

Modal.setAppElement('#root')
class ModalWindow extends React.Component<Props, {}> {
  state = {
    modalIsOpen: false
  }

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
    store.dispatch(clearError())
  }

  render() {
    const buttonClassName = this.props.buttonClassName
    return (
      <>
        <button
          type="button"
          onClick={this.openModal}
          className={buttonClassName}
        >
          {this.props.openButtonText}
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={styles}
          contentLabel="modal"
        >
          {this.props.children}
          <button
            type="button"
            onClick={this.closeModal}
            className="modal__close button-close"
          ></button>
        </Modal>
      </>
    )
  }
}

export default ModalWindow
