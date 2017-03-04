// @flow

import React, { PropTypes } from 'react'

const Message = ({ message }: { message: string }) =>
  <p>{message}</p>

Message.propTypes = {
  message: PropTypes.string.isRequired,
}

export default Message
