import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Дневник путешествий — API',
      version: '1.0.0',
      description: 'REST API для приложения «Дневник путешествий». Авторизация через JWT (Bearer-токен или ?token=). Все эндпоинты, кроме register/login, требуют авторизацию.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'https://travel-server-k5xo.onrender.com',
        description: 'Продакшен-сервер (Render)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Токен из логина/регистрации',
        },
        tokenQuery: {
          type: 'apiKey',
          in: 'query',
          name: 'token',
          description: 'JWT-токен как query-параметр (альтернатива для заголовка)',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
          },
        },
        Country: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            predefId: { type: 'string', example: 'FR' },
            name: { type: 'string', example: 'Франция' },
            emoji: { type: 'string', example: '🇫🇷' },
            visited: { type: 'boolean', example: false },
            coords: {
              type: 'object',
              properties: { lat: { type: 'number' }, lng: { type: 'number' } },
            },
            totalCities: { type: 'integer' },
            tripCount: { type: 'integer' },
          },
        },
        City: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            countryId: { type: 'string' },
            name: { type: 'string', example: 'Москва' },
            coords: {
              type: 'object',
              properties: { lat: { type: 'number' }, lng: { type: 'number' } },
            },
            visited: { type: 'boolean', example: true },
          },
        },
        Attraction: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            cityId: { type: 'string' },
            name: { type: 'string', example: 'Эйфелева башня' },
            visited: { type: 'boolean', example: false },
          },
        },
        Trip: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            cityId: { type: 'string', nullable: true },
            countryId: { type: 'string', nullable: true },
            title: { type: 'string' },
            description: { type: 'string' },
            dateFrom: { type: 'string', format: 'date' },
            dateTo: { type: 'string', format: 'date' },
          },
        },
        Photo: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            filename: { type: 'string' },
            originalName: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);
