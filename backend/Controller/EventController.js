const fs = require('fs');
const path = require('path');
const Event = require('../Models/Event');
const multer = require('multer');
const { body, validationResult } = require('express-validator');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDir = 'public/uploads/';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (error) {
      console.error('Error creating upload directory:', error);
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    try {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    } catch (error) {
      console.error('Error naming file:', error);
      cb(error, null);
    }
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      console.error('Invalid file type:', file.mimetype);
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Validation rules
const validateCreateEvent = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('link').optional().isURL().withMessage('Invalid URL format')
];

// Create Event
const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, title, description, category, link } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const newEvent = new Event({
      username,
      title,
      description,
      category,
      link: link || '',
      image: imagePath.replace('public', '')
    });

    await newEvent.save();

    return res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });

  } catch (error) {
    console.error('Error creating Event:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      message: 'Failed to create Event',
      error: error.message
    });
  }
};

// Get all Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching Events:', error);
    return res.status(500).json({
      message: 'Failed to fetch Events',
      error: error.message
    });
  }
};

// Get Event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching Event:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Event ID format' });
    }
    return res.status(500).json({
      message: 'Failed to fetch Event',
      error: error.message
    });
  }
};

// Delete Event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    if (event.image && fs.existsSync(`public${event.image}`)) {
      fs.unlinkSync(`public${event.image}`);
    }

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting Event:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Event ID format' });
    }
    return res.status(500).json({
      message: 'Failed to delete Event',
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent: [upload.single('image'), validateCreateEvent, createEvent],
  deleteEvent,
  upload
};