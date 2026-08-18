import City from '../models/City.js';
import Attraction from '../models/Attraction.js';
import VisitedCity from '../models/VisitedCity.js';
import VisitedCountry from '../models/VisitedCountry.js';
import VisitedAttraction from '../models/VisitedAttraction.js';
import Trip from '../models/Trip.js';

function titleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|[\-\s])([a-zа-яё])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

export async function getCities(req, res, next) {
  try {
    const { countryId, visited } = req.query;
    const filter = {};
    if (countryId) filter.countryId = countryId;

    const cities = await City.find(filter).sort({ name: 1 }).lean();

    const visitedCitiesAll = await VisitedCity.find({ userId: req.userId }).lean();
    const visitedCitiesSet = new Set(visitedCitiesAll.map((v) => v.cityId.toString()));

    let result = cities.map((city) => ({
      ...city,
      visited: visitedCitiesSet.has(city._id.toString()),
    }));

    if (visited === 'true') {
      result = result.filter((c) => c.visited);
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCityById(req, res, next) {
  try {
    const city = await City.findById(req.params.id).lean();
    if (!city) return res.status(404).json({ error: 'Город не найден' });

    const visited = await VisitedCity.findOne({ userId: req.userId, cityId: city._id });
    const attractions = await Attraction.find({ cityId: city._id }).lean();

    const visitedAttractions = await VisitedAttraction.find({ userId: req.userId }).lean();
    const visitedAttrSet = new Set(visitedAttractions.map((v) => v.attractionId.toString()));

    const attractionsWithStatus = attractions.map((a) => ({
      ...a,
      visited: visitedAttrSet.has(a._id.toString()),
    }));

    const trips = await Trip.find({ userId: req.userId, cityId: city._id }).lean();

    res.json({
      ...city,
      visited: !!visited,
      attractions: attractionsWithStatus,
      trips,
    });
  } catch (err) {
    next(err);
  }
}

export async function addCity(req, res, next) {
  try {
    const { countryId, name, coords } = req.body;
    if (!countryId || !name) return res.status(400).json({ error: 'countryId и name обязательны' });

    const normalizedName = titleCase(name);

    const existing = await City.findOne({
      countryId,
      name: { $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });
    if (existing) return res.status(409).json({ error: 'Город уже существует' });

    const city = await City.create({ countryId, name: normalizedName, coords: coords || { lat: 0, lng: 0 }, custom: true });
    res.status(201).json(city);
  } catch (err) {
    next(err);
  }
}

export async function toggleCityVisited(req, res, next) {
  try {
    const cityId = req.params.id;
    const city = await City.findById(cityId);
    const countryId = city ? city.countryId.toString() : null;

    const existing = await VisitedCity.findOneAndDelete({ userId: req.userId, cityId });
    if (existing) {
      return res.json({ visited: false, countryId });
    }
    await VisitedCity.create({ userId: req.userId, cityId });

    // Auto-mark country as visited when a city is visited
    if (countryId) {
      const already = await VisitedCountry.findOne({ userId: req.userId, countryId: city.countryId });
      if (!already) {
        await VisitedCountry.create({ userId: req.userId, countryId: city.countryId });
      }
    }

    res.json({ visited: true, countryId });
  } catch (err) {
    next(err);
  }
}