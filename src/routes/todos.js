const express = require('express');
const { createTodo, getTodos, getTodo, updateTodo, deleteTodo } = require('../controllers/todoController');
const { validate } = require('../middlewares/validation');
const { createTodoSchema, updateTodoSchema } = require('../schemas/todoSchema');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/', authenticate, validate(createTodoSchema), createTodo);
router.get('/', authenticate, getTodos);
router.get('/:id', authenticate, getTodo);
router.put('/:id', authenticate, validate(updateTodoSchema), updateTodo);
router.delete('/:id', authenticate, deleteTodo);

module.exports = router;