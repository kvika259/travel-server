import mongoose from 'mongoose';

const visitedCitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
}, { timestamps: true });

visitedCitySchema.index({ userId: 1, cityId: 1 }, { unique: true });

export default mongoose.model('VisitedCity', visitedCitySchema);