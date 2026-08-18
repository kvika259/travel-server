/**
 * @openapi
 * /api/countries:
 *   get:
 *     summary: Список всех стран со статистикой
 *     tags: [Страны]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: 'string' }
 *         description: Фильтр по названию (case-insensitive)
 *     responses:
 *       200:
 *         description: Список стран
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *       401:
 *         description: Неавторизован
 *   post:
 *     summary: Добавить новую страну
 *     tags: [Страны]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: 'string', example: 'Португалия' }
 *               emoji: { type: 'string', example: '🇵🇹' }
 *               coords:
 *                 type: object
 *                 properties:
 *                   lat: { type: 'number' }
 *                   lng: { type: 'number' }
 *     responses:
 *       201:
 *         description: Страна создана
 *       409:
 *         description: Страница уже существует
 * @openapi
 * /api/countries/{id}:
 *   get:
 *     summary: Информация о стране с городами и воспоминаниями
 *     tags: [Страны]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       200:
 *         description: Данные страны, города, воспоминания
 *       404:
 *         description: Страна не найдена
 * @openapi
 * /api/countries/{id}/visited:
 *   patch:
 *     summary: Переключить статус «Посетил» для страны
 *     tags: [Страны]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
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
import { getCountries, getCountryById, addCountry, toggleCountryVisited } from '../controllers/countryController.js';
import { authMiddleware } from '../middleware/auth.js';
import { addCountryValidation, countryIdValidation, searchValidation } from '../validators.js';
import { validationErrorHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(authMiddleware);

router.get('/', searchValidation, validationErrorHandler, getCountries);
router.get('/:id', countryIdValidation, validationErrorHandler, getCountryById);
router.post('/', addCountryValidation, validationErrorHandler, addCountry);
router.patch('/:id/visited', countryIdValidation, validationErrorHandler, toggleCountryVisited);

export default router;
