const express = require('express');
const router = express.Router();
const { fetchUser, fetchTasks, patchTasks, addTask, deleteTask } = require('../Controller/userController');

router.get('/:id', fetchUser);
router.get('/tasks/:id', fetchTasks);
router.patch('/tasks/:id', patchTasks);
router.post('/tasks/:id', addTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;