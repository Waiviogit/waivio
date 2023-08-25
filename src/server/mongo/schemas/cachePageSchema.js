import mongoose, { Schema } from 'mongoose';

const CachePageSchema = new Schema(
  {
    url: { type: String, required: true, index: true },
    html: { type: String, required: true },
  },
  { _id: false, timestamps: true },
);

CachePageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const cachePageModel = mongoose.model('cachePage', CachePageSchema);

export default cachePageModel;
