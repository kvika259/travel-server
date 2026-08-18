import mongoose from 'mongoose';

const attractionSchema = new mongoose.Schema({
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  name: { type: String, required: true },
  custom: { type: Boolean, default: false },
  predefId: { type: String, unique: true, sparse: true },
});

export default mongoose.model('Attraction', attractionSchema);