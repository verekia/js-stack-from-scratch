// @flow

import React, { PropTypes } from 'react'

const BarkButton = ({ bark }: { bark: Function }) =>
  <button onClick={bark}>Bark</button>

BarkButton.propTypes = {
  bark: PropTypes.func.isRequired,
}

export default BarkButton
