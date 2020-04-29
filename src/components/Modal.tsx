import React from 'react'
import Modal from 'react-modal'
import LoginForm from '@/components/LoginForm'

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

Modal.setAppElement('#root')
class ModalWindow extends React.Component {
  state = {
    modalIsOpen: false
  }

  openModal = () => {
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  render() {
    return (
      <>
        <button type="button" onClick={this.openModal}>
          {this.props.children}
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={styles}
          contentLabel="modal"
        >
          <LoginForm></LoginForm>
          {/* <LoginForm closeModal={this.closeModal}></LoginForm> */}
          <button type="button" onClick={this.closeModal}>
            Close
          </button>
        </Modal>
      </>
    )
  }
}

export default ModalWindow