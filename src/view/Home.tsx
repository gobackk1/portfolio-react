import React from 'react'
import RecordsList from '@/components/RecordsList'
import { connect } from 'react-redux'
import LoadSpinner from '@/components/LoadSpinner'

interface Props {
  home: any
}

class Home extends React.Component<Props> {
  state = {
    isLoading: false
  }

  _isMounted: boolean = false

  get isMounted(): boolean {
    return this._isMounted
  }

  set isMounted(param: boolean) {
    this._isMounted = param
  }

  async componentDidMount() {
    this.isMounted = true
    const { init, dispatchReadStudyRecords } = this.props.home
    if (!init) {
      this.setState({ isLoading: true })
      await dispatchReadStudyRecords(10)
      //Note: マウントされていないコンポーネントでsetStateを呼び出すとエラーになる
      if (!this.isMounted) return
      this.setState({ isLoading: false })
    }
  }

  componentWillUnmount() {
    this.isMounted = false
  }

  render() {
    const { home } = this.props
    const { isLoading } = this.state
    return (
      <div className="l-inner">
        <LoadSpinner active={isLoading}></LoadSpinner>
        {!isLoading && <RecordsList state={home}></RecordsList>}
      </div>
    )
  }
}

const mapStateToProps = state => ({ home: state.home })

export default connect(mapStateToProps, null)(Home)
