const express = require('express');
const Notification = require('../models/Notification');

const router = express.Router();

// Get all notifications for user
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new notification
router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;
    const notification = new Notification({
      user: userId,
      message,
    });

    const createdNotification = await notification.save();

    if (req.io) {
      req.io.emit(`notification_${userId}`, createdNotification);
    }

    res.status(201).json(createdNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      notification.isRead = true;
      const updatedNotification = await notification.save();
      res.json(updatedNotification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
