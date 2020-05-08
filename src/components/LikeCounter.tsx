import React from 'react'
import axios, { auth } from '@/axios'
import classNames from 'classnames'

interface Props {
  record: any
}

const likeUrl: string = `${process.env.REACT_APP_API_URL}/likes`

class LikeCounter extends React.Component<Props, {}> {
  state = {
    isLiked: false,
    count: 0,
    disabled: false
  }
  _isMounted: boolean = false

  get isMounted(): boolean {
    return this._isMounted
  }

  set isMounted(boolean: boolean) {
    this._isMounted = boolean
  }

  fetchCount = async id => {
    this.setState({ disabled: true })
    const res = await axios.get(`${likeUrl}/${id}/all`, auth)
    if (!this.isMounted) return
    this.setState({ ...res.data, disabled: false })
  }

  createLike = async study_record_id => {
    this.setState({ disabled: true })
    const res = await axios.post(likeUrl, { study_record_id }, auth)
    if (!this.isMounted) return
    this.setState({ ...res.data, disabled: false })
  }

  destroyLike = async id => {
    this.setState({ disabled: true })
    const res = await axios.delete(`${likeUrl}/${id}`, auth)
    if (!this.isMounted) return
    this.setState({ ...res.data, disabled: false })
  }

  onClickLike: ((id: number) => void) | null = id => {
    this.state.isLiked ? this.destroyLike(id) : this.createLike(id)
  }

  componentDidMount = () => {
    this.fetchCount(this.props.record.id)
    this.isMounted = true
  }

  componentWillUnmount = () => {
    this.onClickLike = null
    this.isMounted = false
  }

  render() {
    const { id } = this.props.record
    const { isLiked, disabled, count } = this.state
    const likeCounterClass = classNames({
      'like-counter': !isLiked,
      'like-counter--liked': isLiked
    })
    return (
      <>
        <button
          onClick={() => this.onClickLike!(id)}
          disabled={disabled}
          className={likeCounterClass}
        >
          {isLiked ? (
            <i className="fas fa-heart"></i>
          ) : (
            <i className="far fa-heart"></i>
          )}
          <span className="counter">{count}</span>
        </button>
      </>
    )
  }
}

export default LikeCounter
