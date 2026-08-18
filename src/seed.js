import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Country from './models/Country.js';
import City from './models/City.js';
import Attraction from './models/Attraction.js';
import countriesData from './data/countries.json' with { type: 'json' };
import { seedCities, seedAttractions } from './data/seedData.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB подключена');

    // ── Страны из статического JSON ──
    console.log('\n🌍 Загрузка стран из локального датасета...');
    console.log(`   ${countriesData.length} стран в датасете`);

    let addedCountries = 0;
    for (const c of countriesData) {
      const existing = await Country.findOne({ predefId: c.cca2 });
      if (!existing) {
        await Country.create({
          predefId: c.cca2,
          name: c.name,
          emoji: c.emoji,
          coords: { lat: c.lat, lng: c.lng },
        });
        addedCountries++;
      }

      // Столица — сразу создаём город
      if (c.capital) {
        const capitalPredefId = `${c.cca2}-capital`;
        const existingCity = await City.findOne({ predefId: capitalPredefId });
        if (!existingCity) {
          const country = await Country.findOne({ predefId: c.cca2 });
          if (country) {
            await City.create({
              predefId: capitalPredefId,
              countryId: country._id,
              name: c.capital,
              coords: { lat: c.capitalLat || c.lat, lng: c.capitalLng || c.lng },
            });
          }
        }
      }
    }
    console.log(`   + Добавлено ${addedCountries} новых стран (со столицами)`);

    // ── Дополнительные города из seed-данных ──
    console.log('\n🏙️ Дополнительные города...');
    const countryMap = {};
    const countries = await Country.find().lean();
    for (const c of countries) {
      if (c.predefId) countryMap[c.predefId] = c._id;
    }

    for (const c of seedCities) {
      const existing = await City.findOne({ predefId: c.predefId });
      if (!existing) {
        const countryId = countryMap[c.countryCca2];
        if (!countryId) {
          console.log(`  ⚠️ Пропуск города ${c.name}: страна ${c.countryCca2} не найдена`);
          continue;
        }
        const { countryCca2, ...cityData } = c;
        await City.create({ ...cityData, countryId });
        console.log(`  + Город: ${c.name}`);
      }
    }

    // ── Достопримечательности из seed-данных ──
    console.log('\n🏛️ Достопримечательности...');
    const cityMap = {};
    const cities = await City.find().lean();
    for (const c of cities) {
      if (c.predefId) cityMap[c.predefId] = c._id;
    }

    for (const a of seedAttractions) {
      const existing = await Attraction.findOne({ predefId: a.predefId });
      if (!existing) {
        const cityId = cityMap[a.cityPredefId];
        if (!cityId) {
          console.log(`  ⚠️ Пропуск достопримечательности ${a.name}: город ${a.cityPredefId} не найден`);
          continue;
        }
        const { cityPredefId, ...attrData } = a;
        await Attraction.create({ ...attrData, cityId });
        console.log(`  + Достопримечательность: ${a.name}`);
      }
    }

    const totalCountries = await Country.countDocuments();
    const totalCities = await City.countDocuments();
    const totalAttractions = await Attraction.countDocuments();
    console.log(`\n✅ Seed завершён: ${totalCountries} стран, ${totalCities} городов, ${totalAttractions} достопримечательностей`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка seed:', err);
    process.exit(1);
  }
}

seed();