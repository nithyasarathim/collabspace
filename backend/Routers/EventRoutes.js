const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent
} = require('../Controller/EventController');

router.get('/get', getAllEvents);             
router.get('/get/:id', getEventById);          
router.post('/create', createEvent);             
router.delete('/delete/:id', deleteEvent);    

module.exports = router;