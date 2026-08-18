import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
  name: { type: String, required: true },
  coords: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
  },
  custom: { type: Boolean, default: false },
  predefId: { type: String, unique: true, sparse: true },
});

export default mongoose.model('City', citySchema);