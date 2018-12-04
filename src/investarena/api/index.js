import Brokers from './Brokers';
import Deals from './Deals';
import Authentications from './authentications/Authentications';
import ApiClient from './ApiClient';

export default function({ apiPrefix } = {}) {
  const api = new ApiClient({ prefix: apiPrefix});
  return {
    authentications: new Authentications({apiClient: api}),
    brokers: new Brokers({ apiClient: api }),
    deals: new Deals({ apiClient: api }),
  };
}
