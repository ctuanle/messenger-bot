import { Router, Request, Response } from 'express';
import { handleMessage } from './handlers';

const webhook = Router();

// webhook verify token endpoint (GET /webhook)
// this allows Messenger Platform validating the webhook
webhook.get('/', (req: Request, res: Response) => {
  /* global process */
  const verify_token = process.env.VERIFY_TOKEN;

  // query params sent by Messenger Platform
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      res.status(200).send(challenge);
    } else {
      // 403 Forbidden
      res.sendStatus(403);
    }
  }
});

// POST (/webhoook)
// handle POST requests (event) sent by Messenger Platform
webhook.post('/', (req: Request, res: Response) => {
  const body = req.body;
  if (body?.object === 'page') {
    body?.entry.forEach((entry: any) => {
      const webhook_event = entry.messaging[0];

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(webhook_event.sender.id, webhook_event.message);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // unknown request body
    res.sendStatus(404);
  }
});

export default webhook;
