// Тестовый скрипт для проверки работы OpenTripMap API
import dotenv from 'dotenv';
dotenv.config();

import { fetchAttractions } from './src/utils/opentripmap.js';

async function testApi() {
  console.log('🧪 Тестирование OpenTripMap API...');
  
  // Попробуем получить достопримечательности для Праги (Чехия)
  const attractions = await fetchAttractions(50.087, 14.421, 10000, 'museums,historic_architecture');
  
  console.log(`\n✅ Найдено ${attractions.length} достопримечательностей:`);
  
  attractions.forEach((attr, index) => {
    console.log(`${index + 1}. ${attr.name}`);
    if (attr.description) {
      console.log(`   Описание: ${attr.description.substring(0, 100)}...`);
    }
    if (attr.coords) {
      console.log(`   Координаты: ${attr.coords.lat.toFixed(4)}, ${attr.coords.lng.toFixed(4)}`);
    }
    console.log('');
  });
  
  console.log('🎉 Тест API завершён!');
}

testApi().catch(console.error);