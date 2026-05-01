const express = require('express');
const { body, param } = require('express-validator');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('title').isLength({ min: 1, max: 120 }).withMessage('Title is required (1-120 chars)'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status')
  ],
  validate,
  taskController.createTask
);

router.get('/', taskController.getTasks);

router.get('/:id', [param('id').isMongoId().withMessage('Invalid task id')], validate, taskController.getTaskById);

router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid task id'),
    body('title').optional().isLength({ min: 1, max: 120 }).withMessage('Title must be 1-120 chars'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
    body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status')
  ],
  validate,
  taskController.updateTask
);

router.delete('/:id', [param('id').isMongoId().withMessage('Invalid task id')], validate, taskController.deleteTask);

module.exports = router;