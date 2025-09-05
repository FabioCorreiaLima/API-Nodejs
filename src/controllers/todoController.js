const todoRepository = require('../repositories/todoRepository');

const createTodo = async (req, res) => {
  try {
    const todo = await todoRepository.create({
      ...req.body,
      owner: req.userId
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await todoRepository.findByOwner(req.userId);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTodo = async (req, res) => {
  try {
    const todo = await todoRepository.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo não encontrado' });
    }
    if (todo.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const todo = await todoRepository.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo não encontrado' });
    }
    if (todo.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    const updatedTodo = await todoRepository.update(req.params.id, req.body);
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await todoRepository.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo não encontrado' });
    }
    if (todo.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    await todoRepository.delete(req.params.id);
    res.json({ message: 'Todo deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo
};