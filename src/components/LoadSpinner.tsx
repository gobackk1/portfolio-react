import React from 'react'

interface Props {
  active: boolean
}

const LoadSpinner: React.SFC<Props> = ({ active }) =>
  active ? (
    <div className="tac">
      <div className="dot-spin">
        <div className="dot-spin__spinner"></div>
      </div>
    </div>
  ) : null

export default LoadSpinner
