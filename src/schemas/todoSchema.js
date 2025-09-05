const zod = require('zod');

const createTodoSchema = zod.object({
  title: zod.string().min(1, "Título é obrigatório")
});

const updateTodoSchema = zod.object({
  title: zod.string().min(1, "Título é obrigatório").optional(),
  done: zod.boolean().optional()
});

module.exports = {
  createTodoSchema,
  updateTodoSchema
};