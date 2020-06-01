import React from 'react'
import RecordsList from '@/components/RecordsList'
import store from '@/store'
import { connect } from 'react-redux'
import { readFollowUserStudyRecords } from '@/actions/home'

interface Props {
  home: any
}

class Home extends React.Component<Props> {
  constructor(props) {
    super(props)
    store.dispatch(readFollowUserStudyRecords({ page: 1, per: 10 }))
  }

  render() {
    const { records, onLoadStudyRecords } = this.props.home
    return (
      <div className="l-inner">
        <RecordsList
          data={records}
          onLoadStudyRecords={onLoadStudyRecords}
        ></RecordsList>
      </div>
    )
  }
}

const mapStateToProps = state => ({ home: state.home })

export default connect(mapStateToProps, null)(Home)
