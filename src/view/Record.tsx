import React from 'react'
import Modal from '@/components/Modal'
import RecordForm from '@/components/RecordForm'

interface Props {}

class Record extends React.Component<Props, {}> {
  render() {
    return (
      <>
        <Modal openButtonText="教材なしで記録する" buttonClassName="mock">
          <RecordForm type="post"></RecordForm>
        </Modal>
        新しい教材を登録する
      </>
    )
  }
}

export default Record
