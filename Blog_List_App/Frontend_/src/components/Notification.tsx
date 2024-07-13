import React from 'react'

const Notification = (props) => {
    const {errorMessage} = props
  return (
    <div>
      <h1>{errorMessage}</h1>
    </div>
  )
}

export default Notification
