// @flow

/* eslint-disable no-console */

import express from 'express'

import { EXPRESS_PORT, STATIC_PATH } from '../shared/config'
import masterTemplate from './template/master-template'

const app = express()

app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

app.get('/', (req, res) => {
  res.send(masterTemplate('Dog App'))
})

app.listen(EXPRESS_PORT, () => {
  console.log(`Express running on port ${EXPRESS_PORT}.`)
})
