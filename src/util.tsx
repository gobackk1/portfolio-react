import React from 'react'

//redux-form用の関数

export const renderField = field => {
  const {
    input,
    label,
    type,
    meta: { touched, error }
  } = field
  return (
    <>
      <input placeholder={label} type={type} {...input} className="input" />
      <div className="error-msg">{touched && error}</div>
    </>
  )
}

export const renderErrorMessages = error => {
  if (!error) return
  return error.response.data.messages.map((msg, index) => {
    return (
      <p className="error-msg" key={index}>
        *{msg}
      </p>
    )
  })
}

export const renderTextarea = field => {
  const {
    input,
    label,
    type,
    meta: { touched, error }
  } = field

  return (
    <>
      <textarea
        {...input}
        cols="20"
        rows="10"
        placeholder={label}
        className="textarea"
      ></textarea>
      <div className="error-msg">{touched && error}</div>
    </>
  )
}

export const renderFile = field => {
  let {
    input: { value, name, onChange },
    label,
    type,
    meta: { touched, error }
  } = field

  return (
    <>
      <input
        placeholder={label}
        type="file"
        onChange={e => {
          e.preventDefault()
          if (!e.target.files) return
          onChange(e.target.files[0])
        }}
      />
      <div>{touched && error}</div>
    </>
  )
}

export const encode64 = image => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (!reader.result) return
      const result = reader.result as string
      const base64 = result.slice(result.indexOf(',') + 1)
      resolve(base64)
    }
    reader.readAsDataURL(image)
  })
}
