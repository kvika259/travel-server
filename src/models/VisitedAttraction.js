import mongoose from 'mongoose';

const visitedAttractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attractionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attraction', required: true },
}, { timestamps: true });

visitedAttractionSchema.index({ userId: 1, attractionId: 1 }, { unique: true });

export default mongoose.model('VisitedAttraction', visitedAttractionSchema);