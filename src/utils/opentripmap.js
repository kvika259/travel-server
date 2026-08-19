import axios from 'axios';

// OpenTripMap API - бесплатный API для достопримечательностей
// Документация: https://opentripmap.com/ru/doc/api
// Регистрация для получения API ключа: https://opentripmap.com/ru/account/register

import dotenv from 'dotenv';
dotenv.config();

const OPENTRIPMAP_API_KEY = process.env.OPENTRIPMAP_API_KEY;
const BASE_URL = 'https://api.opentripmap.com/0.1/ru/places';

/**
 * Получает достопримечательности вокруг заданных координат
 * @param {number} lat - широта центра
 * @param {number} lng - долгота центра  
 * @param {number} radius - радиус поиска в метрах (макс 50000)
 * @param {string} kinds - категории объектов (через запятую)
 * @returns {Promise<Array>} массив объектов достопримечательностей
 */
export async function fetchAttractions(lat, lng, radius = 10000, kinds = 'museums,historic_architecture,monuments_and_memorials,natural,cultural') {
  try {
    // Сначала получаем список объектов
    const listResponse = await axios.get(`${BASE_URL}/radius`, {
      params: {
        radius,
        lon: lng,
        lat,
        kinds,
        limit: 20, // максимум 500, но возьмём 20 самых релевантных
        format: 'json',
        apikey: OPENTRIPMAP_API_KEY
      }
    });

    const places = listResponse.data;
    if (!places || !Array.isArray(places)) {
      return [];
    }

    // Получаем детали для каждого объекта
    const attractionDetails = [];
    for (const place of places.slice(0, 15)) { // ограничим 15 объектами
      try {
        const detailResponse = await axios.get(`${BASE_URL}/xid/${place.xid}`, {
          params: {
            apikey: OPENTRIPMAP_API_KEY
          }
        });
        
        const detail = detailResponse.data;
        attractionDetails.push({
          name: detail.name || place.name,
          xid: place.xid,
          kinds: detail.kinds || place.kinds,
          distance: place.dist,
          coords: {
            lat: detail.point?.lat || lat,
            lng: detail.point?.lon || lng
          },
          wikipedia: detail.wikipedia,
          image: detail.preview?.source,
          description: detail.wikipedia_extracts?.text?.substring(0, 200)
        });
      } catch (detailError) {
        // Если не удалось получить детали, используем базовую информацию
        attractionDetails.push({
          name: place.name,
          xid: place.xid,
          kinds: place.kinds,
          distance: place.dist,
          coords: {
            lat: lat,
            lng: lng
          }
        });
      }
    }

    return attractionDetails;
  } catch (error) {
    console.error('Ошибка при загрузке достопримечательностей из OpenTripMap:', error.message);
    return [];
  }
}

/**
 * Преобразует данные из OpenTripMap в формат модели Attraction
 * @param {Object} attractionData - данные из API
 * @param {ObjectId} cityId - ID города в нашей БД
 * @returns {Object} объект для сохранения в MongoDB
 */
export function mapToAttractionModel(attractionData, cityId) {
  return {
    cityId,
    name: attractionData.name,
    custom: false,
    predefId: `otm-${attractionData.xid}`
  };
}