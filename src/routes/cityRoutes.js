/**
 * @openapi
 * /api/cities:
 *   get:
 *     summary: Список городов с фильтрацией и сортировкой по имени
 *     tags: [Города]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: query
 *         name: countryId
 *         schema: { type: 'string' }
 *         description: Фильтр по стране
 *       - in: query
 *         name: visited
 *         schema: { type: 'boolean' }
 *         description: Только посещённые города
 *     responses:
 *       200:
 *         description: Список городов (сортировка по алфавиту)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       401:
 *         description: Неавторизован
 *   post:
 *     summary: Добавить новый город
 *     tags: [Города]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [countryId, name]
 *             properties:
 *               countryId: { type: 'string', example: '507f1f77bcf86cd799439011' }
 *               name: { type: 'string', example: 'Минск' }
 *               coords:
 *                 type: object
 *                 properties:
 *                   lat: { type: 'number' }
 *                   lng: { type: 'number' }
 *     responses:
 *       201:
 *         description: Город создан
 *       400:
 *         description: Обязательные поля не указаны
 *       409:
 *         description: Город уже существует в этой стране
 * @openapi
 * /api/cities/{id}:
 *   get:
 *     summary: Информация о городе с достопримечательностями и воспоминаниями
 *     tags: [Города]
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
 *         description: Данные города, достопримечательности, поездки
 *       404:
 *         description: Город не найден
 * @openapi
 * /api/cities/{id}/visited:
 *   patch:
 *     summary: Переключить статус «Посетил» для города
 *     tags: [Города]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     description: Автоматически отмечает страну как посещённую
 *     responses:
 *       200:
 *         description: Новый статус
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 visited: { type: 'boolean' }
 *                 countryId: { type: 'string', nullable: true }
 */
import { Router } from 'express';
import { getCities, getCityById, addCity, toggleCityVisited } from '../controllers/cityController.js';
import { authMiddleware } from '../middleware/auth.js';
import { addCityValidation, cityIdValidation, countryFilterValidation } from '../validators.js';
import { validationErrorHandler } from '../middleware/errorHandler.js';

const router = Router();

router.use(authMiddleware);

router.get('/', countryFilterValidation, validationErrorHandler, getCities);
router.get('/:id', cityIdValidation, validationErrorHandler, getCityById);
router.post('/', addCityValidation, validationErrorHandler, addCity);
router.patch('/:id/visited', cityIdValidation, validationErrorHandler, toggleCityVisited);

export default router;
