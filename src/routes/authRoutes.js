/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Авторизация]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username: { type: 'string', example: 'ivan' }
 *               email: { type: 'string', format: 'email', example: 'ivan@example.com' }
 *               password: { type: 'string', minLength: 6, example: 'secret123' }
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: 'string' }
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Ошибка валидации
 *       409:
 *         description: Пользователь уже существует
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Вход в аккаунт
 *     tags: [Авторизация]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: 'string', format: 'email', example: 'ivan@example.com' }
 *               password: { type: 'string', example: 'secret123' }
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: 'string' }
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Неверный email или пароль
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [Авторизация]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     responses:
 *       200:
 *         description: Данные пользователя
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Неавторизован
 */
import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../validators.js';
import { validationErrorHandler } from '../middleware/errorHandler.js';

const router = Router();

router.post('/register', registerValidation, validationErrorHandler, register);
router.post('/login', loginValidation, validationErrorHandler, login);
router.get('/me', authMiddleware, me);

export default router;
