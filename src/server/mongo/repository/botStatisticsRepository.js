import botUserAgentModel from '../schemas/botStatisticsSchema';

const updateOne = async ({ filter, update, options }) => {
  try {
    const result = await botUserAgentModel.updateOne(filter, update, options);
    return { result };
  } catch (error) {
    return { error };
  }
};

const incrementVisit = async ({ userAgent }) => {
  const { result } = await updateOne({
    filter: { userAgent },
    update: { $inc: { timesEntered: 1 } },
    options: { upsert: true },
  });
  return result;
};

export default {
  incrementVisit,
};
