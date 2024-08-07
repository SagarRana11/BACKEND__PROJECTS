import React from 'react'

const Notification = (props) => {
    const {errorMessage} = props
  return (
    <div>
      <h2>{errorMessage}</h2>
    </div>
  )
}

export default Notification
