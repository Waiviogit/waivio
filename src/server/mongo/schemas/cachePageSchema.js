import { Schema, model } from 'mongoose/browser';

const CachePageSchema = new Schema(
  {
    url: { type: String, required: true, index: true },
    page: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

CachePageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 3 });

const CachePageModel = model('CachePage', CachePageSchema, 'cache_page');
export default CachePageModel;
