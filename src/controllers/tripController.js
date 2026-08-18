import Trip from '../models/Trip.js';
import Photo from '../models/Photo.js';
import Country from '../models/Country.js';
import City from '../models/City.js';
import VisitedCity from '../models/VisitedCity.js';
import VisitedCountry from '../models/VisitedCountry.js';

export async function getTrips(req, res, next) {
  try {
    const { search, countryId } = req.query;
    const filter = { userId: req.userId };
    if (countryId) filter.countryId = countryId;

    let trips = await Trip.find(filter).lean();

    if (search) {
      const lower = search.toLowerCase();
      trips = trips.filter(
        (t) =>
          t.title.toLowerCase().includes(lower) ||
          (t.description && t.description.toLowerCase().includes(lower))
      );
    }

    // Enrich with city/country names
    const enriched = await Promise.all(
      trips.map(async (t) => {
        const city = t.cityId ? await City.findById(t.cityId).lean() : null;
        const country = t.countryId ? await Country.findById(t.countryId).lean() : null;
        return { ...t, cityName: city?.name, countryName: country?.name, countryEmoji: country?.emoji };
      })
    );

    res.json(enriched);
  } catch (err) {
    next(err);
  }
}

export async function getTripById(req, res, next) {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!trip) return res.status(404).json({ error: 'Воспоминание не найдено' });

    const city = trip.cityId ? await City.findById(trip.cityId).lean() : null;
    const country = trip.countryId ? await Country.findById(trip.countryId).lean() : null;

    res.json({
      ...trip,
      cityName: city?.name,
      countryName: country?.name,
      countryEmoji: country?.emoji,
    });
  } catch (err) {
    next(err);
  }
}

export async function createTrip(req, res, next) {
  try {
    const { cityId, countryId, title, description, dateFrom, dateTo } = req.body;
    if (!title) return res.status(400).json({ error: 'Заголовок обязателен' });

    const trip = await Trip.create({
      userId: req.userId,
      cityId: cityId || null,
      countryId: countryId || null,
      title,
      description: description || '',
      dateFrom: dateFrom || '',
      dateTo: dateTo || '',
      photos: [],
    });

    // Авто-отметка города и страны как посещённых при создании воспоминания
    if (cityId) {
      const existingVisitedCity = await VisitedCity.findOne({ userId: req.userId, cityId });
      if (!existingVisitedCity) {
        await VisitedCity.create({ userId: req.userId, cityId });
      }

      // Получаем countryId из города, если не указан явно
      const city = await City.findById(cityId);
      const resolvedCountryId = countryId || city?.countryId?.toString();

      if (resolvedCountryId) {
        const existingVisitedCountry = await VisitedCountry.findOne({ userId: req.userId, countryId: resolvedCountryId });
        if (!existingVisitedCountry) {
          await VisitedCountry.create({ userId: req.userId, countryId: resolvedCountryId });
        }
      }
    } else if (countryId) {
      // Если указан только countryId (без cityId), отмечаем страну
      const existingVisitedCountry = await VisitedCountry.findOne({ userId: req.userId, countryId });
      if (!existingVisitedCountry) {
        await VisitedCountry.create({ userId: req.userId, countryId });
      }
    }

    res.status(201).json(trip);
  } catch (err) {
    next(err);
  }
}

export async function updateTrip(req, res, next) {
  try {
    const { title, description, dateFrom, dateTo } = req.body;
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description, dateFrom, dateTo },
      { new: true, runValidators: true }
    );
    if (!trip) return res.status(404).json({ error: 'Воспоминание не найдено' });
    res.json(trip);
  } catch (err) {
    next(err);
  }
}

export async function deleteTrip(req, res, next) {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ error: 'Воспоминание не найдено' });

    // Delete associated photos
    if (trip.photos?.length) {
      await Photo.deleteMany({ _id: { $in: trip.photos } });
    }

    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}

export async function uploadPhoto(req, res, next) {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ error: 'Воспоминание не найдено' });

    if (!req.file) return res.status(400).json({ error: 'Файл не предоставлен' });

    const photo = await Photo.create({
      userId: req.userId,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
    });

    trip.photos.push(photo._id);
    await trip.save();

    res.status(201).json({ photoId: photo._id });
  } catch (err) {
    next(err);
  }
}

export async function getPhoto(req, res, next) {
  try {
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).json({ error: 'Фото не найдено' });

    res.set('Content-Type', photo.contentType);
    res.send(photo.data);
  } catch (err) {
    next(err);
  }
}

export async function deletePhoto(req, res, next) {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.userId });
    if (!trip) return res.status(404).json({ error: 'Воспоминание не найдено' });

    const photoId = req.params.photoId;
    trip.photos = trip.photos.filter((p) => p.toString() !== photoId);
    await trip.save();
    await Photo.findByIdAndDelete(photoId);

    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
}