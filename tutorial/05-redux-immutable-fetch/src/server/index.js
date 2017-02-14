// @flow

/* eslint-disable no-console */

import express from 'express'

import routes from '../shared/routes'
import { EXPRESS_PORT, STATIC_PATH } from '../shared/config'
import masterTemplate from './template/master-template'

const app = express()

app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

app.get('/', (req, res) => {
  res.send(masterTemplate('Dog App'))
})

app.get(routes.asyncBark, (req, res) => {
  res.send({ message: 'Wah wah! (from the server)' })
})

app.listen(EXPRESS_PORT, () => {
  console.log(`Express running on port ${EXPRESS_PORT}.`)
})
