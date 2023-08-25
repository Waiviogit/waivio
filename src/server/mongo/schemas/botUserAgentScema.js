import mongoose, { Schema } from 'mongoose';

const BotUserAgentSchema = new Schema({
  type: { type: String, required: true },
  userAgents: { type: [String], required: true, index: true },
});

const botUserAgentModel = mongoose.model('botUserAgent', BotUserAgentSchema);

export default botUserAgentModel;
