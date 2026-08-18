/**
 * @openapi
 * /api/trips:
 *   get:
 *     summary: Список воспоминаний (поездок)
 *     tags: [Воспоминания]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: 'string' }
 *         description: Поиск по заголовку/описанию
 *       - in: query
 *         name: countryId
 *         schema: { type: 'string' }
 *         description: Фильтр по стране
 *     responses:
 *       200:
 *         description: Список поездок
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *   post:
 *     summary: Создать новое воспоминание
 *     tags: [Воспоминания]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               cityId: { type: 'string', nullable: true }
 *               countryId: { type: 'string', nullable: true }
 *               title: { type: 'string', example: 'Отпуск в Париже' }
 *               description: { type: 'string', example: 'Замечательная поездка!' }
 *               dateFrom: { type: 'string', format: 'date' }
 *               dateTo: { type: 'string', format: 'date' }
 *     responses:
 *       201:
 *         description: Воспоминание создано
 *       400:
 *         description: Ошибка валидации
 * @openapi
 * /api/trips/{id}:
 *   get:
 *     summary: Получить воспоминание по ID
 *     tags: [Воспоминания]
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
 *         description: Данные воспоминания с фото
 *       404:
 *         description: Воспоминание не найдено
 *   patch:
 *     summary: Обновить воспоминание
 *     tags: [Воспоминания]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: 'string' }
 *               description: { type: 'string' }
 *               dateFrom: { type: 'string', format: 'date' }
 *               dateTo: { type: 'string', format: 'date' }
 *     responses:
 *       200:
 *         description: Воспоминание обновлено
 *       404:
 *         description: Воспоминание не найдено
 *   delete:
 *     summary: Удалить воспоминание
 *     tags: [Воспоминания]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       204:
 *         description: Воспоминание удалено
 *       404:
 *         description: Воспоминание не найдено
 * @openapi
 * /api/trips/{id}/photos:
 *   post:
 *     summary: Загрузить фото для воспоминания
 *     tags: [Фото]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Фото загружено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Photo'
 *       400:
 *         description: Ошибка загрузки
 * @openapi
 * /api/trips/{id}/photos/{photoId}:
 *   get:
 *     summary: Получить фото по ID
 *     tags: [Фото]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       200:
 *         description: Бинарные данные фото
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Фото не найдено
 *   delete:
 *     summary: Удалить фото
 *     tags: [Фото]
 *     security:
 *       - bearerAuth: []
 *       - tokenQuery: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       204:
 *         description: Фото удалено
 *       404:
 *         description: Фото не найдено
 */
import { Router } from 'express';
import multer from 'multer';
import {
  getTrips, getTripById, createTrip, updateTrip, deleteTrip,
  uploadPhoto, getPhoto, deletePhoto,
} from '../controllers/tripController.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  createTripValidation, tripIdValidation, photoIdValidation, searchValidation
} from '../validators.js';
import { validationErrorHandler } from '../middleware/errorHandler.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.use(authMiddleware);

router.get('/', searchValidation, validationErrorHandler, getTrips);
router.get('/:id', tripIdValidation, validationErrorHandler, getTripById);
router.post('/', createTripValidation, validationErrorHandler, createTrip);
router.patch('/:id', tripIdValidation, validationErrorHandler, updateTrip);
router.delete('/:id', tripIdValidation, validationErrorHandler, deleteTrip);
router.post('/:id/photos', upload.single('photo'), uploadPhoto);
router.get('/:id/photos/:photoId', photoIdValidation, validationErrorHandler, getPhoto);
router.delete('/:id/photos/:photoId', photoIdValidation, validationErrorHandler, deletePhoto);

export default router;
