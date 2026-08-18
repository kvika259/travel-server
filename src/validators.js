import { body, param, query } from 'express-validator';

// Авторизация
export const registerValidation = [
  body('username').trim().notEmpty().withMessage('Имя пользователя обязательно'),
  body('email').isEmail().normalizeEmail().withMessage('Неверный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль минимум 6 символов'),
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Неверный email'),
  body('password').notEmpty().withMessage('Пароль обязателен'),
];

// Страны
export const addCountryValidation = [
  body('name').trim().notEmpty().withMessage('Название страны обязательно'),
  body('emoji').optional().isString(),
];

export const countryIdValidation = [
  param('id').isMongoId().withMessage('Неверный ID страны'),
];

// Города
export const addCityValidation = [
  body('countryId').isMongoId().withMessage('Неверный ID страны'),
  body('name').trim().notEmpty().withMessage('Название города обязательно'),
  body('coords').optional().isObject().withMessage('Координаты должны быть объектом'),
  body('coords.lat').if(body('coords').exists()).isFloat().withMessage('Неверная широта'),
  body('coords.lng').if(body('coords').exists()).isFloat().withMessage('Неверная долгота'),
];

export const cityIdValidation = [
  param('id').isMongoId().withMessage('Неверный ID города'),
];

// Достопримечательности
export const addAttractionValidation = [
  body('cityId').isMongoId().withMessage('Неверный ID города'),
  body('name').trim().notEmpty().withMessage('Название достопримечательности обязательно'),
];

export const attractionIdValidation = [
  param('id').isMongoId().withMessage('Неверный ID достопримечательности'),
];

// Поездки
export const createTripValidation = [
  body('title').trim().notEmpty().withMessage('Заголовок обязателен'),
  body('description').optional().trim(),
  body('cityId').optional().isMongoId().withMessage('Неверный ID города'),
  body('countryId').optional().isMongoId().withMessage('Неверный ID страны'),
  body('dateFrom').optional().isISO8601().toDate().withMessage('Неверная дата начала'),
  body('dateTo').optional().isISO8601().toDate().withMessage('Неверная дата окончания'),
];

export const tripIdValidation = [
  param('id').isMongoId().withMessage('Неверный ID поездки'),
];

// Фото
export const photoIdValidation = [
  param('photoId').isMongoId().withMessage('Неверный ID фото'),
];

// Общие параметры
export const searchValidation = [
  query('search').optional().trim(),
];

export const countryFilterValidation = [
  query('countryId').optional().isMongoId().withMessage('Неверный ID страны'),
  query('visited').optional().isBoolean().withMessage('visited должен быть true/false'),
];
