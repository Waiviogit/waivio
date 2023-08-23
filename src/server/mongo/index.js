import mongoose from 'mongoose/browser';
import botUserAgentRepository from './repository/botUserAgentRepository';
import googleAgents from '../../common/constants/googleUserAgents';
import { MONGO_URI } from '../../common/constants/ssrData';

export cachePageRepository from './repository/cachePageRepository';
export botUserAgentRepository from './repository/botUserAgentRepository';
export botStatisticsRepository from './repository/botStatisticsRepository';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`mongo connected`);
    botUserAgentRepository.createUserAgent({
      type: 'google',
      userAgents: googleAgents,
    });
  })
  .catch(error => console.log(error));

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('close', () => console.log(`closed mongo connection`));
