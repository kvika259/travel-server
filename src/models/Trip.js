import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  dateFrom: { type: String, default: '' },
  dateTo: { type: String, default: '' },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
}, { timestamps: true });

export default mongoose.model('Trip', tripSchema);