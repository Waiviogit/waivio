import mongoose, { Schema } from 'mongoose';

const BotStatisticsSchema = new Schema({
  userAgent: { type: String, required: true, index: true },
  timesEntered: { type: Number, required: true },
});

const botStatisticsModel = mongoose.model('botStatistics', BotStatisticsSchema);

export default botStatisticsModel;
