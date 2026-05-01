const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || '',
      status: req.body.status || 'pending',
      owner: req.user._id
    });

    return res.status(201).json({ message: 'Task created', task });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while creating task' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { owner: req.user._id };
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while fetching tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: cannot access this task' });
    }

    return res.status(200).json({ task });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: cannot update this task' });
    }

    const allowedFields = ['title', 'description', 'status'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();
    return res.status(200).json({ message: 'Task updated', task });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: cannot delete this task' });
    }

    await task.deleteOne();
    return res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
};