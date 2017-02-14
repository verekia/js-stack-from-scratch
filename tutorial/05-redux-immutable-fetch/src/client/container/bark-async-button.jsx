// @flow

import { connect } from 'react-redux'

import { barkAsync } from '../action/dog'
import BarkAsyncButton from '../component/bark-async-button'

const mapDispatchToProps = dispatch => ({
  barkAsync: () => { dispatch(barkAsync()) },
})

export default connect(null, mapDispatchToProps)(BarkAsyncButton)
