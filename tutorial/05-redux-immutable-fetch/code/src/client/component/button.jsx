// @flow

import React, { PropTypes } from 'react'

const Button = ({ label, handleClick }: { label: string, handleClick: Function }) =>
  <button onClick={handleClick}>{label}</button>

Button.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
}

export default Button
