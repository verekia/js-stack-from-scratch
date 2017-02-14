// @flow

import { connect } from 'react-redux'

import { bark } from '../action/dog'
import BarkButton from '../component/bark-button'

const mapDispatchToProps = dispatch => ({
  bark: () => { dispatch(bark('Wah wah!')) },
})

export default connect(null, mapDispatchToProps)(BarkButton)
