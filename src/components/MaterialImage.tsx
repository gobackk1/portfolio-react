import React from 'react'

interface Props {
  bgUrl: string
  height: number
}

const MaterialImage: React.SFC<Props> = ({ bgUrl, height }) => (
  <div
    style={{
      background: bgUrl,
      height: height,
      width: '100%'
    }}
  ></div>
)

export default MaterialImage
