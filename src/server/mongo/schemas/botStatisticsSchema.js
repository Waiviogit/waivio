import { Schema, model } from 'mongoose/browser';

const BotStatisticsSchema = new Schema(
  {
    userAgent: { type: String, required: true, unique: true, index: true },
    timesEntered: { type: Number, required: true, default: 0 },
  },
  { versionKey: false, timestamps: true },
);

BotStatisticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

const BotStatisticsModel = model('BotStatistics', BotStatisticsSchema, 'bot_statistics');

export default BotStatisticsModel;
