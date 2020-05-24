import React from 'react'

interface Props {
  messages: Array<string>
}
const ErrorMessages: React.SFC<Props> = ({ messages }) => (
  <>
    {messages.map((msg, index) => {
      if (!msg) return
      return (
        <p className="error-msg" key={index}>
          *{msg}
        </p>
      )
    })}
  </>
)

export default ErrorMessages
