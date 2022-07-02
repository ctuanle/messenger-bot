import axios from 'axios';

import { BOT_DATA } from './bot_data';

// Handles messages events
export function handleMessage(sender_psid: string, received_message: any) {
  const response: { [key: string]: any } = {};

  if (received_message.text) {
    const msg: string = received_message.text.trim().toLowerCase();

    if (BOT_DATA[msg]) {
      response.text = BOT_DATA[msg];

      // config quick reply
      // response.quick_replies = BOT_DATA.quick_replies.map((rep) => ({
      //   content_type: 'text',
      //   title: rep,
      //   payload: 'Required, but currently not use',
      // }));
    } else {
      // send what we received
      response.text = `Sorry, I current do not understand this << ${msg} >> 😉`;
    }
  } else if (received_message.attachments) {
    response.text = "I'm current not able to handle messages with attachment. 🦊";
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
export function callSendAPI(sender_psid: any, response: any) {
  // Construct the message body
  const request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  /* global process */
  axios
    .post(
      `https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.ACCESS_TOKEN}`,
      request_body
    )
    .then((res) => console.log('MSG_SENT', res.status))
    .catch((err) => console.error(err));
}
