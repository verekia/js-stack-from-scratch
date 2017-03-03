// @flow

/* eslint-disable no-console */

import express from 'express';
import masterLayout from './templates/master-layout';

const app = express();
const port = 3000;

app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  res.send(masterLayout('Homepage'));
});

app.get('/makebark', (req, res) => {
  res.send({ hasBarked: true });
});

app.listen(port, () => {
  console.log(`Express running on port ${port}`);
});
