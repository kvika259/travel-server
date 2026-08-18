import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: { type: String, default: '🌍' },
  coords: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  custom: { type: Boolean, default: false },
  predefId: { type: String, unique: true, sparse: true },
});

export default mongoose.model('Country', countrySchema);