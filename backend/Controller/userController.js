const User = require('../Models/User');
const mongoose = require('mongoose');

const fetchUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: `Error fetching user: ${error.message}` });
    }
}

const fetchTasks = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('tasks');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.tasks);
    } catch (error) {
        res.status(500).json({ message: `Error fetching tasks: ${error.message}` });
    }
}

const patchTasks = async (req, res) => {
    try {
        const userId = req.params.id;
        const { taskId, completed } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const update = {
            $set: {
                'tasks.$[elem].isCompleted': completed,
                'tasks.$[elem].completedAt': completed ? new Date() : null
            }
        };

        const options = {
            arrayFilters: [{ 'elem._id': new mongoose.Types.ObjectId(taskId) }],
            new: true
        };

        const user = await User.findByIdAndUpdate(
            userId,
            update,
            options
        ).select('tasks');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.tasks);
    } catch (error) {
        res.status(500).json({ message: `Error updating task: ${error.message}` });
    }
}

const addTask = async (req, res) => {
    try {
        const userId = req.params.id;
        const { description } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        if (!description || description.trim() === '') {
            return res.status(400).json({ message: 'Task description is required' });
        }

        const newTask = {
            description: description.trim(),
            isCompleted: false
        };

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { tasks: newTask } },
            { new: true }
        ).select('tasks');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the last task (which is the newly added one)
        const addedTask = user.tasks[user.tasks.length - 1];
        res.status(201).json(addedTask);
    } catch (error) {
        res.status(500).json({ message: `Error adding task: ${error.message}` });
    }
}

const deleteTask = async (req, res) => {
    try {
        const userId = req.params.id;
        const { taskId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { tasks: { _id: taskId } } },
            { new: true }
        ).select('tasks');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ taskId, tasks: user.tasks });
    } catch (error) {
        res.status(500).json({ message: `Error deleting task: ${error.message}` });
    }
}

module.exports = {
    fetchUser,
    fetchTasks,
    patchTasks,
    addTask,
    deleteTask
};