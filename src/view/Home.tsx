import React from 'react'
import RecordsList from '@/components/RecordsList'
import { connect } from 'react-redux'
import LoadSpinner from '@/components/LoadSpinner'

interface Props {
  home: any
}

class Home extends React.Component<Props> {
  constructor(props) {
    super(props)

    if (!this.props.home.init) {
      console.log(this.props.home.init)
      this.props.home.dispatchReadStudyRecords(10)
    }
  }

  componentDidMount() {}

  render() {
    const { home } = this.props
    return (
      <div className="l-inner">
        <RecordsList state={home}></RecordsList>
      </div>
    )
  }
}

const mapStateToProps = state => ({ home: state.home })

export default connect(mapStateToProps, null)(Home)
