import mongoose from 'mongoose';

const visitedCountrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
}, { timestamps: true });

visitedCountrySchema.index({ userId: 1, countryId: 1 }, { unique: true });

export default mongoose.model('VisitedCountry', visitedCountrySchema);