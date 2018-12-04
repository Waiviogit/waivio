import Base from './Base';
import config from '../configApi/config';

export default class Deals extends Base {
    getPostOpenDeals (params) {
        return this.apiClient.get(config.deals.deals, {}, params);
    }
    createOpenDeal (data) {
        return this.apiClient.post(`${config.deals.deals}`, data);
    }
    getLastClosedDeal (params) {
        return this.apiClient.get(`${config.deals.lastClosedDeals}`, {}, params);
    }
    updateOpenDealsForStatistics (data) {
        return this.apiClient.post(`${config.deals.createOpenDeals}`, data);
    }
    updateClosedDealsForStatistics (data) {
        return this.apiClient.post(`${config.deals.createClosedDeals}`, data);
    }
}
