import React from 'react'
import { connect } from 'react-redux'

interface Props {
  user: any
}

class RenderIfLogout extends React.Component<Props, {}> {
  static defaultProps = {
    user: {}
  }
  render() {
    return (
      <>
        {(() => {
          if (!this.props.user.token) {
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

export default connect(mapStateToProps, null)(RenderIfLogout)
