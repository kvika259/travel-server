import Country from '../models/Country.js';
import City from '../models/City.js';
import Attraction from '../models/Attraction.js';
import VisitedCountry from '../models/VisitedCountry.js';
import VisitedCity from '../models/VisitedCity.js';
import VisitedAttraction from '../models/VisitedAttraction.js';
import Trip from '../models/Trip.js';

function titleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|[\-\s])([a-zа-яё])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

export async function getCountries(req, res, next) {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };

    const countries = await Country.find(filter).lean();

    const visitedCountries = await VisitedCountry.find({ userId: req.userId }).lean();
    const visitedSet = new Set(visitedCountries.map((v) => v.countryId.toString()));

    const cities = await City.find().lean();
    const attractions = await Attraction.find().lean();
    const trips = await Trip.find({ userId: req.userId }).lean();

    const result = countries.map((country) => {
      const countryCities = cities.filter((c) => c.countryId.toString() === country._id.toString());
      const cityIds = countryCities.map((c) => c._id.toString());
      const visitedCities = countryCities.filter((c) =>
        cities.some((cc) => cc._id.toString() === c._id.toString())
      );

      const visitedCitiesCount = countryCities.reduce((acc, city) => {
        return acc + (visitedSet.has(country._id.toString()) ? 0 : 0);
      }, 0);

      const countryAttractions = attractions.filter((a) => cityIds.includes(a.cityId.toString()));
      const countryTrips = trips.filter((t) => t.countryId?.toString() === country._id.toString());

      const cityVisited = {};
      // We need to get visited cities separately
      return {
        ...country,
        visited: visitedSet.has(country._id.toString()),
        totalCities: countryCities.length,
        tripCount: countryTrips.length,
      };
    });

    // Get visited cities for stats
    const visitedCitiesAll = await VisitedCity.find({ userId: req.userId }).lean();
    const visitedCitiesSet = new Set(visitedCitiesAll.map((v) => v.cityId.toString()));

    const visitedAttractionsAll = await VisitedAttraction.find({ userId: req.userId }).lean();
    const visitedAttractionsSet = new Set(visitedAttractionsAll.map((v) => v.attractionId.toString()));

    const finalResult = result.map((country) => {
      const countryCities = cities.filter((c) => c.countryId.toString() === country._id.toString());
      const cityIds = countryCities.map((c) => c._id.toString());
      const vCities = countryCities.filter((c) => visitedCitiesSet.has(c._id.toString())).length;
      const countryAttractions = attractions.filter((a) => cityIds.includes(a.cityId.toString()));
      const vAttractions = countryAttractions.filter((a) => visitedAttractionsSet.has(a._id.toString())).length;

      return {
        ...country,
        visitedCities: vCities,
        visitedAttractions: vAttractions,
        totalAttractions: countryAttractions.length,
      };
    });

    res.json(finalResult);
  } catch (err) {
    next(err);
  }
}

export async function getCountryById(req, res, next) {
  try {
    const country = await Country.findById(req.params.id).lean();
    if (!country) return res.status(404).json({ error: 'Страна не найдена' });

    const visited = await VisitedCountry.findOne({ userId: req.userId, countryId: country._id });
    const cities = await City.find({ countryId: country._id }).sort({ name: 1 }).lean();
    const trips = await Trip.find({ userId: req.userId, countryId: country._id }).lean();

    const visitedCitiesAll = await VisitedCity.find({ userId: req.userId }).lean();
    const visitedCitiesSet = new Set(visitedCitiesAll.map((v) => v.cityId.toString()));

    const citiesWithStats = [];
    for (const city of cities) {
      const attractions = await Attraction.find({ cityId: city._id }).lean();
      const visitedAttractions = await VisitedAttraction.find({ userId: req.userId }).lean();
      const visitedAttrSet = new Set(visitedAttractions.map((v) => v.attractionId.toString()));
      const cityTrips = await Trip.find({ userId: req.userId, cityId: city._id }).lean();

      citiesWithStats.push({
        ...city,
        visited: visitedCitiesSet.has(city._id.toString()),
        totalAttrs: attractions.length,
        visitedAttrs: attractions.filter((a) => visitedAttrSet.has(a._id.toString())).length,
        tripCount: cityTrips.length,
      });
    }

    res.json({
      ...country,
      visited: !!visited,
      cities: citiesWithStats,
      trips,
    });
  } catch (err) {
    next(err);
  }
}

export async function addCountry(req, res, next) {
  try {
    const { name, emoji, coords } = req.body;
    if (!name) return res.status(400).json({ error: 'Название обязательно' });

    const normalizedName = titleCase(name);

    const existing = await Country.findOne({
      name: { $regex: `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' },
    });
    if (existing) return res.status(409).json({ error: 'Страна уже существует' });

    const country = await Country.create({ name: normalizedName, emoji: emoji || '🌍', coords: coords || { lat: 0, lng: 0 }, custom: true });
    res.status(201).json(country);
  } catch (err) {
    next(err);
  }
}

export async function toggleCountryVisited(req, res, next) {
  try {
    const countryId = req.params.id;
    const existing = await VisitedCountry.findOneAndDelete({ userId: req.userId, countryId });
    if (existing) {
      return res.json({ visited: false });
    }
    await VisitedCountry.create({ userId: req.userId, countryId });
    res.json({ visited: true });
  } catch (err) {
    next(err);
  }
}