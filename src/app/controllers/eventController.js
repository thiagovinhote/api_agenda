const express = require('express');

const Event = require('../models/event');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const { userId } = req;
  try {
    console.log(userId);
    const events = await Event.find({ user: userId });

    return res.send(events);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send({ error: 'Error get events' });
  }
});

router.get('/:_id', async (req, res) => {
  const { _id } = req.params;

  try {
    const event = await Event.findById(_id);

    if (!event)
      return res.status(400).send({ error: 'Event not found' });

    return res.send(event);
  } catch (e) {
    return res.status(400).send({ error: 'Error search event' });
  }
});

router.delete('/:_id', async (req, res) => {
  const { _id } = req.params;

  try {
    const event = await Event.findByIdAndRemove(_id);

    if (!event)
      return res.status(400).send({ error: 'Event not found' });

    return res.send(event);
  } catch (e) {
    return res.status(400).send({ error: 'Delete event failed' });
  }
});

router.post('/', async (req, res) => {
  const { body } = req;

  try {
    const event = await Event.create(body);

    return res.send(event);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ error: 'Save event failed' });
  }
});


router.put('/:_id', async (req, res) => {
  const { _id } = req.params;

  try {
    const event = await Event.findByIdAndUpdate(_id, {
      '$set': req.body,
    }, { new: true });

    if (!event)
      return res.status(400).send({ error: 'Event not found.' });

    return res.send(event);
  } catch (e) {
    return res.status(400).send({ error: 'Update event failed' });
  }
});

module.exports = app => app.use('/events', router);
