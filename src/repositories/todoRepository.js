const Todo = require('../models/Todo');

class TodoRepository {
  async create(todoData) {
    const todo = new Todo(todoData);
    return await todo.save();
  }

  async findById(id) {
    return await Todo.findById(id);
  }

  async findByOwner(ownerId) {
    return await Todo.find({ owner: ownerId }).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Todo.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return await Todo.findByIdAndDelete(id);
  }
}

module.exports = new TodoRepository();