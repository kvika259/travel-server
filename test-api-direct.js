// Тестовый скрипт для проверки работы OpenTripMap API с правильным форматом
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'https://api.opentripmap.com/0.1/ru/places';
const OPENTRIPMAP_API_KEY = process.env.OPENTRIPMAP_API_KEY;

async function testApiAccess() {
  console.log('🧪 Тестирование OpenTripMap API...');
  console.log('Используемый ключ:', OPENTRIPMAP_API_KEY ? 'ДА' : 'НЕТ');
  
  if (!OPENTRIPMAP_API_KEY) {
    console.log('⚠️  API ключ не найден в .env файле');
    return;
  }
  
  // Попробуем получить информацию о конкретной точке с использованием ключа
  try {
    // Получим достопримечательности рядом с Прагой
    const response = await axios.get(`${BASE_URL}/radius`, {
      params: {
        radius: 5000,
        lon: 14.421,
        lat: 50.087,
        kinds: 'museums',
        limit: 5,
        format: 'json',
        apikey: OPENTRIPMAP_API_KEY
      }
    });
    
    console.log('✅ Успешный ответ от API:');
    console.log(`Найдено достопримечательностей: ${response.data.length}`);
    console.log(response.data.slice(0, 2)); // Показываем первые 2 результата
    
  } catch (error) {
    console.log(`❌ Ошибка: ${error.response?.status} - ${error.response?.statusText}`);
    if (error.response?.data) {
      console.log('Данные ошибки:', error.response.data);
    }
    console.log('Сформированный URL:', error.config?.url);
  }
  
  // Попробуем вызвать другой эндпоинт для проверки
  try {
    console.log('\n🔍 Проверяем эндпоинт geoname...');
    const geoResponse = await axios.get(`${BASE_URL}/geoname`, {
      params: {
        name: 'Prague',
        apikey: OPENTRIPMAP_API_KEY
      }
    });
    
    console.log('✅ Ответ geoname:', geoResponse.data);
  } catch (error) {
    console.log(`❌ Ошибка geoname: ${error.response?.status} - ${error.response?.statusText}`);
  }
}

testApiAccess().catch(console.error);