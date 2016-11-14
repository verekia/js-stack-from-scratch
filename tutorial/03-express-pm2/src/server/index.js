// @flow

/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import { PORT, STATIC_PATH } from './config';
import masterLayout from './templates/master-layout';

const app = express();

app.use(STATIC_PATH, express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send(masterLayout('Homepage'));
});

app.listen(PORT, () => {
  console.log(`Express running on port ${PORT}.`);
});
