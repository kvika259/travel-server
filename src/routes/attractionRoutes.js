/**
 * @openapi
 * /api/attractions:
 *   post:
 *     summary: Добавить достопримечательность
 *     tags: [Достопримечательности]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cityId, name]
 *             properties:
 *               cityId: { type: 'string', example: '507f1f77bcf86cd799439011' }
 *               name: { type: 'string', example: 'Красная площадь' }
 *     responses:
 *       201:
 *         description: Достопримечательность создана
 *       400:
 *         description: Обязательные поля не указаны
 *       409:
 *         description: Достопримечательность уже существует в этом городе
 * @openapi
 * /api/attractions/{id}/visited:
 *     summary: Переключить статус «Посетил» для достопримечательности
 *     tags: [Достопримечательности]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     description: Автоматически отмечает город и страну как посещённые
 *     responses:
 *       200:
 *         description: Новый статус
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 visited: { type: 'boolean' }
 */
import { Router } from 'express';
import { addAttraction, toggleAttractionVisited } from '../controllers/attractionController.js';
import { authMiddleware } from '../middleware/auth.js';
import { addAttractionValidation, attractionIdValidation } from '../validators.js';
import { validationErrorHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(authMiddleware);

router.post('/', addAttractionValidation, validationErrorHandler, addAttraction);
router.patch('/:id/visited', attractionIdValidation, validationErrorHandler, toggleAttractionVisited);

export default router;
