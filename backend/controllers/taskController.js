const asyncHandler = require('express-async-handler');

const Task = require('../models/taskModel');

const getTask = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
});

const setTask = asyncHandler(async (req, res) => {
    if (!req.body || !req.body.text) {
        res.status(400);
        throw new Error('please put a task');
    }
    const task = await Task.create({ text: req.body.text, user: req.user.id });
    res.status(200).json(task);
});

//putTask = eshte njesoj me updateTask!

const putTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(400);
        throw new Error('task not found !');
    }
    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('user is not authorized');
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        res.status(400);
        throw new Error('task not found !');
    }
    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('user is not authorized to delete ');
    }
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json(req.params.id);
});




module.exports = { getTask, putTask, deleteTask, setTask }