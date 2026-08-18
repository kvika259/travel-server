import { validationResult } from 'express-validator';

export function validationErrorHandler(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
}

export function errorHandler(err, req, res, _next) {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(', ') });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `${field} уже занят` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Неверный ID' });
  }

  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
}