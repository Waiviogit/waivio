import { Schema, model } from 'mongoose/browser';

const BotUserAgentSchema = new Schema(
  {
    type: { type: String, required: true, unique: true },
    userAgents: { type: [String], required: true, index: true },
  },
  { versionKey: false },
);

const BotUserAgentModel = model('BotUserAgent', BotUserAgentSchema, 'bot_user_agent');

export default BotUserAgentModel;
