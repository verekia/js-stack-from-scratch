// @flow

import { connect } from 'react-redux'

import Message from '../component/message'

const mapStateToProps = state => ({
  message: state.dog.get('barkMessage'),
})

export default connect(mapStateToProps)(Message)
