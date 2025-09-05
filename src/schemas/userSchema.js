const zod = require('zod');

const registerSchema = zod.object({
  name: zod.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  email: zod.string()
    .email("Email inválido")
    .max(100, "Email deve ter no máximo 100 caracteres"),
  password: zod.string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha deve ter no máximo 100 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial")
});

const loginSchema = zod.object({
  email: zod.string().email("Email inválido"),
  password: zod.string().min(1, "Senha é obrigatória")
});

module.exports = {
  registerSchema,
  loginSchema
};