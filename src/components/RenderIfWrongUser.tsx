import React from 'react'
import { connect } from 'react-redux'

interface Props {
  user: any
  userId: number
  children?: any
}

class RenderIfWrongUser extends React.Component<Props, {}> {
  static defaultProps = {
    user: {}
  }
  render() {
    return (
      <>
        {(() => {
          if (this.props.user.id !== this.props.userId) {
            return <>{this.props.children}</>
          }
        })()}
      </>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, null)(RenderIfWrongUser)
