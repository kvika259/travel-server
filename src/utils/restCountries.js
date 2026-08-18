const BASE_URL = 'https://restcountries.com/v5';

export async function fetchAllCountries() {
  try {
    console.log('   Запрос: ' + `${BASE_URL}/all`);
    const res = await fetch(`${BASE_URL}/all`);

    if (!res.ok) {
      const text = await res.text();
      console.error('   API ответ:', res.status, text.slice(0, 200));
      throw new Error(`REST Countries API error: ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error('   API вернул не массив:', JSON.stringify(data).slice(0, 300));
      throw new Error('REST Countries API вернул неожиданный формат данных');
    }

    return data;
  } catch (err) {
    if (err.message.startsWith('REST Countries')) throw err;
    console.error('   Ошибка fetch:', err.message);
    throw new Error('Не удалось загрузить страны из REST Countries API: ' + err.message);
  }
}

export function mapApiCountry(apiCountry) {
  // v5 формат
  const ruName = apiCountry.translations?.rus?.common;
  const name = ruName || apiCountry.name?.common || 'Unknown';
  const emoji = apiCountry.flag || '🌍';
  const coords = apiCountry.latlng
    ? { lat: apiCountry.latlng[0], lng: apiCountry.latlng[1] }
    : { lat: 0, lng: 0 };
  const cca2 = apiCountry.cca2;

  let capital = null;
  let capitalCoords = null;
  if (apiCountry.capital && apiCountry.capital.length > 0) {
    capital = apiCountry.capital[0];
    if (apiCountry.capitalInfo?.latlng) {
      capitalCoords = {
        lat: apiCountry.capitalInfo.latlng[0],
        lng: apiCountry.capitalInfo.latlng[1],
      };
    } else if (apiCountry.latlng) {
      capitalCoords = { lat: apiCountry.latlng[0], lng: apiCountry.latlng[1] };
    }
  }

  return { name, emoji, coords, cca2, capital, capitalCoords };
}