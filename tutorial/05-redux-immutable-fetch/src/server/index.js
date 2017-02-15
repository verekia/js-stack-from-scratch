// @flow

/* eslint-disable no-console */

import express from 'express'

import { APP_NAME, STATIC_PATH, WEB_PORT } from '../shared/config'
import { asyncHelloRoute } from '../shared/routes'
import staticTemplate from './static-template'

const app = express()

app.use(STATIC_PATH, express.static('dist'))
app.use(STATIC_PATH, express.static('public'))

app.get('/', (req, res) => {
  res.send(staticTemplate(APP_NAME))
})

app.get(asyncHelloRoute(), (req, res) => {
  res.json({ message: `Hello from the server! (received ${req.params.num})` })
})

app.listen(WEB_PORT, () => {
  console.log(`Express running on port ${WEB_PORT}.`)
})
