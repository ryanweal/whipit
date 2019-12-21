
exports.send = async (req, res, next) => {

  if (!req.params.id || req.params.id === 0) {
    res.status(403).send({
      error: 'Please submit a id!'
    });
    return;
  }

  let to = undefined;
  const users = process.env.USERS.split(',').map(element => element.split('/'));

  for (const user of users) {
    if (user[0] === req.params.id) {
      to = user[1];
    }
  }

  if (to === undefined) {
    res.status(403).send({
      error: 'User id is not valid!'
    });
    return;
  }

  if (!req.params.message || req.params.message === 0) {
    res.status(403).send({
      error: 'Please submit a message!'
    });
    return;
  }

  if (req.params.message.length > 240) {
    res.status(403).send({
      error: 'Please submit a shorter message (shorter than 240 characters)!'
    });
    return;
  }

  // Twilio Credentials
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_TOKEN;

  // require the Twilio module and create a REST client
  const client = require('twilio')(accountSid, authToken);

  client.messages
    .create({
      to: to,
      from: process.env.TWILIO_FROM,
      body: `${req.params.id}: ${req.params.message}`
    })
    .then((message) => {
      res.send(`Sent message: ${req.params.id}: ${req.params.message}`);
    })
    .catch(e => {
      res.status(403).send({
        error: 'Problem with SMS gateway!'
      });
      return;
    });

};