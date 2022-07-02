import express, { Application, json } from 'express';
import webhook from './webhook';

/* global process */
const PORT = process.env.PORT || 5000;

const app: Application = express();

app.use(json());
app.use('/webhook', webhook);

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
