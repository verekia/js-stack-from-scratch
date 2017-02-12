// @flow

import React, { PropTypes } from 'react'

const BarkAsyncButton = ({ barkAsync }: { barkAsync: Function }) =>
  <button onClick={barkAsync}>Bark Async</button>

BarkAsyncButton.propTypes = {
  barkAsync: PropTypes.func.isRequired,
}

export default BarkAsyncButton
