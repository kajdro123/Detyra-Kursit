const express = require('express')
const router = express.Router();

const { getTask, putTask, deleteTask, setTask } = require("../controllers/taskController");
const { protect } = require('../middleWare/authMiddleware');

router.get('/', protect, getTask)

router.post('/', protect, setTask)

router.put('/:id', protect, putTask)

router.delete('/:id', protect, deleteTask)


module.exports = router;