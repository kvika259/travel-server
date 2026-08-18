import Attraction from '../models/Attraction.js';
import City from '../models/City.js';
import VisitedAttraction from '../models/VisitedAttraction.js';
import VisitedCity from '../models/VisitedCity.js';
import VisitedCountry from '../models/VisitedCountry.js';

function titleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|[\-\s])([a-zа-яё])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

export async function addAttraction(req, res, next) {
  try {
    const { cityId, name } = req.body;
    if (!cityId || !name) return res.status(400).json({ error: 'cityId и name обязательны' });

    const normalizedName = titleCase(name);

    const existing = await Attraction.findOne({
      cityId,
      name: { $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });
    if (existing) return res.status(409).json({ error: 'Достопримечательность уже существует' });

    const attraction = await Attraction.create({ cityId, name: normalizedName, custom: true });
    res.status(201).json(attraction);
  } catch (err) {
    next(err);
  }
}

export async function toggleAttractionVisited(req, res, next) {
  try {
    const attractionId = req.params.id;
    const existing = await VisitedAttraction.findOneAndDelete({ userId: req.userId, attractionId });
    if (existing) {
      return res.json({ visited: false });
    }
    await VisitedAttraction.create({ userId: req.userId, attractionId });

    // Auto-mark city as visited when an attraction is visited
    const attraction = await Attraction.findById(attractionId);
    if (attraction) {
      const already = await VisitedCity.findOne({ userId: req.userId, cityId: attraction.cityId });
      if (!already) {
        await VisitedCity.create({ userId: req.userId, cityId: attraction.cityId });
      }

      // Auto-mark country as visited when a city is visited
      const city = await City.findById(attraction.cityId);
      if (city) {
        const alreadyCountry = await VisitedCountry.findOne({ userId: req.userId, countryId: city.countryId });
        if (!alreadyCountry) {
          await VisitedCountry.create({ userId: req.userId, countryId: city.countryId });
        }
      }
    }

    res.json({ visited: true });
  } catch (err) {
    next(err);
  }
}