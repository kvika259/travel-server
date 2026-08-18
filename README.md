# 🌍 Дневник путешествий — Сервер

Бэкенд для приложения «Дневник путешествий» на Express + MongoDB с авторизацией.

## Валидация

Все эндпоинты имеют валидацию входных данных:

- **Регистрация/Вход** (`/api/auth/register`, `/api/auth/login`):
  - `username`: не пустой, 1-20 символов
  - `email`: корректный формат
  - `password`: минимум 6 символов

- **Страны** (`/api/countries`):
  - `name`: не пустой
  - `emoji`: опционально, строка
  - `coords`: опционально, объект с `lat` и `lng` (числа)

- **Города** (`/api/cities`):
  - `countryId`: валидный MongoDB ObjectId
  - `name`: не пустой
  - `coords`: опционально, объект с `lat` и `lng` (числа)

- **Достопримечательности** (`/api/attractions`):
  - `cityId`: валидный MongoDB ObjectId
  - `name`: не пустой

- **Поездки** (`/api/trips`):
  - `title`: не пустой
  - `cityId`: опционально, валидный ObjectId
  - `countryId`: опционально, валидный ObjectId
  - `dateFrom`, `dateTo`: опционально, ISO-даты

Все ошибки валидации возвращаются как `400 Bad Request` с описанием ошибки.

## Авторизация

- Регистрация: `POST /api/auth/register` — `{ username, email, password }`
- Вход: `POST /api/auth/login` — `{ email, password }`
- Ответ: `{ token, user: { id, username, email } }`
- Токен JWT, срок действия 30 дней
- Пароль хранится как bcrypt-хеш

## Авторизация запросов

Все защищённые эндпоинты требуют токен одним из двух способов:

1. **Заголовок**: `Authorization: Bearer <token>`
2. **Query-параметр**: `?token=<token>` — для загрузки фото через `<img src>`

## Изоляция данных

Все отметки «Посетил» (`VisitedCountry`, `VisitedCity`, `VisitedAttraction`), поездки (`Trip`) и фото (`Photo`) привязаны к `userId`. Пользователь видит и редактирует только свои данные.

## Каскад авто-отметки

- **Отметка достопримечательности** → автоматически создаётся `VisitedCity` (если ещё нет) и `VisitedCountry` (если ещё нет)
- **Отметка города** → автоматически создаётся `VisitedCountry` (если ещё нет)
- Снятие отметки не удаляет `VisitedCountry` (страна может остаться посещённой из-за других городов)

## Сортировка

- **Города** — все списки городов сортируются по `name` (алфавит): при просмотре страны (`getCountryById`) и в общем списке (`getCities`).
```js
await City.find({ countryId }).sort({ name: 1 });
await City.find(filter).sort({ name: 1 });
```

## Нормализация и дубликаты

- **Title Case**: имена стран, городов и достопримечательностей нормализуются — первая буква каждого слова заглавная, остальные строчные. Поддержка кириллицы (`[a-zа-яё]`).
- **Проверка дубликатов**: case-insensitive поиск существующей записи перед созданием. Возвращает `409` при совпадении.

```js
function titleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|[\-\s])([a-zа-яё])/g, (_, sep, ch) => sep + ch.toUpperCase());
}
```

## API

### Авторизация (без токена)

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/api/auth/register` | Регистрация: `{ username, email, password }` |
| `POST` | `/api/auth/login` | Логин: `{ email, password }` |
| `GET` | `/api/auth/me` | Текущий пользователь (нужен токен) |

### Страны

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/api/countries` | Список стран (с `?search=`, visited-статусы per user, статистика городов/дост.) |
| `GET` | `/api/countries/:id` | Страна с городами и воспоминаниями |
| `POST` | `/api/countries` | Добавить страну: `{ name, emoji?, coords? }` (нормализация + проверка дублей) |
| `PATCH` | `/api/countries/:id/visited` | Переключить «Посетил» → `{ visited: bool }` |

### Города

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/api/cities` | Список городов (фильтры: `?countryId=`, `?visited=true`) |
| `GET` | `/api/cities/:id` | Город с достопримечательностями и воспоминаниями |
| `POST` | `/api/cities` | Добавить город: `{ countryId, name, coords? }` (нормализация + проверка дублей) |
| `PATCH` | `/api/cities/:id/visited` | Переключить «Посетил» → `{ visited, countryId }` + авто-отметка страны |

### Достопримечательности

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/api/attractions` | Добавить: `{ cityId, name }` (нормализация + проверка дублей) |
| `PATCH` | `/api/attractions/:id/visited` | Переключить «Посетил» → `{ visited: bool }` + авто-отметка города и страны |

### Воспоминания

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/api/trips` | Список (фильтры: `?search=&countryId=`) |
| `GET` | `/api/trips/:id` | Одно воспоминание |
| `POST` | `/api/trips` | Создать: `{ cityId?, countryId?, title, description?, dateFrom?, dateTo? }` |
| `PATCH` | `/api/trips/:id` | Обновить: `{ title?, description?, dateFrom?, dateTo? }` |
| `DELETE` | `/api/trips/:id` | Удалить (с фото) |

### Фото

| Метод | Путь | Описание |
|---|---|---|
| `POST` | `/api/trips/:id/photos` | Загрузить фото (multipart/form-data, поле `photo`) |
| `GET` | `/api/trips/:id/photos/:photoId` | Получить фото (бинарный ответ, поддерживает `?token=`) |
| `DELETE` | `/api/trips/:id/photos/:photoId` | Удалить фото |

> Все эндпоинты (кроме `/api/auth/register` и `/api/auth/login`) требуют токен — через `Authorization: Bearer` или `?token=`.

## Структура

```
server/src/
├── index.js                 # Точка входа (Express + MongoDB + CORS)
├── seed.js                  # Заполнение базы из countries.json + seedData.js
├── data/
│   ├── countries.json       # ~250 стран: русские названия, флаги, координаты, столицы
│   └── seedData.js          # Дополнительные города + достопримечательности
├── utils/
│   └── restCountries.js     # Утилита для REST Countries API (резервный вариант)
├── models/
│   ├── User.js              # Пользователи (username, email, password-hash)
│   ├── Country.js           # Страны (predefId = cca2 для seed-данных)
│   ├── City.js              # Города (predefId = cca2-суффикс для seed-данных)
│   ├── Attraction.js        # Достопримечательности
│   ├── VisitedCountry.js    # Посещённые страны (per user, уникальный индекс)
│   ├── VisitedCity.js       # Посещённые города (per user, уникальный индекс)
│   ├── VisitedAttraction.js # Посещённые достопримечательности (per user)
│   ├── Trip.js              # Воспоминания/поездки
│   └── Photo.js             # Фото (бинарные данные в MongoDB)
├── controllers/
│   ├── authController.js       # Регистрация, логин, профиль
│   ├── countryController.js    # CRUD стран + visited toggle + статистика
│   ├── cityController.js       # CRUD городов + getCities (фильтры) + visited toggle (каскад к стране)
│   ├── attractionController.js # CRUD достопримечательностей + visited toggle (каскад к городу и стране)
│   └── tripController.js       # CRUD воспоминаний + фото (upload/get/delete)
├── routes/
│   ├── authRoutes.js
│   ├── countryRoutes.js
│   ├── cityRoutes.js          # GET / (getCities, .sort({ name })) + GET /:id + POST + PATCH /:id/visited
│   ├── attractionRoutes.js
│   └── tripRoutes.js
└── middleware/
    ├── auth.js               # JWT-проверка (Authorization: Bearer или ?token=)
    └── errorHandler.js       # Глобальная обработка ошибок (Validation, DuplicateKey, CastError)
```

## Предзаполненные данные

Источники данных для seed:

1. **`countries.json`** — ~250 стран с русскими названиями, emoji-флагами, координатами и столицами. Статический файл, не зависит от внешних API.
2. **`seedData.js`** — дополнительные города (не столицы) + 100+ достопримечательностей для ключевых туристических стран.

Страны из датасета: Италия, Франция, Испания, Германия, Великобритания, Япония, Таиланд, Турция, США, Россия, и все остальные (~250).
#   t r a v e l - s e r v e r  
 