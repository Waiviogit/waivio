import { getBrokersFormatter, getBrokerFormatter } from './utils/brokersFormatter';
import Base from './Base';
import config from '../configApi/config';
import { setLocalStorageBroker } from './utils/updateLocalStorageApi';

export default class Brokers extends Base {
    getBroker () {
        return this.apiClient.get(`${config.brokers.getBroker}${localStorage.getItem('broker_id')}`, {}, {})
            .then(response => {
                return ({headers: response.headers, data: getBrokerFormatter(response.data.broker), error: response.error});
            });
    }
    getBrokers () {
        return this.apiClient.get(config.brokers.userBrokers, {}, {})
            .then(response => {
                return ({headers: response.headers, data: getBrokersFormatter(response.data.brokers), error: response.error});
            });
    }
    authorizeBroker (data, locale) {
      console.log(data);
      console.log(config.brokers.brokerAuthorization);
        return this.apiClient.post(config.brokers.brokerAuthorization, data)
            .then(response => {
                let status = 'error';
                let message = '';
                if (response.data) {
                    switch (response.data.code) {
                    case 1:
                        status = 'success';
                        // message = locale.messages['brokerAction.authorizeBrokerSuccess'];
                        setLocalStorageBroker(data.platform, response.data);
                        break;
                    case 2:
                        // message = locale.messages['brokerAction.authorizeBrokerErrorCredentials'];
                        break;
                    default:
                        // message = locale.messages['brokerAction.authorizeBrokerError'];
                        break;
                    }
                }
                return ({headers: response.headers, status, message, error: response.error, broker: response.data});
            });
    }
    registerBroker (data, locale) {
        return this.apiClient.post(config.brokers.brokerRegistration, data)
            .then(response => {
                let status = 'error';
                let message = '';
                if (response.data && response.data.broker) {
                    if (!response.data.broker.statusCode) {
                        status = 'success';
                        message = locale.messages['brokerAction.registerBrokerSuccess'];
                    } else if (response.data.broker.statusCode === 500) {
                        message = response.data.broker.message;
                    } else {
                        message = locale.messages['brokerAction.registerBrokerError'];
                    }
                }
                return ({headers: response.headers, status, message, error: response.error});
            });
    }
    reconnectBroker (data, locale) {
        return this.apiClient.post(config.brokers.reconnectBroker, data)
            .then(response => {
                let status = 'error';
                let message = '';
                let result = false;
                if (response.data && response.data.broker) {
                    if (response.data.broker.code === 1) {
                        result = true;
                        status = 'success';
                    } else {
                        message = locale.messages['brokerAction.reconnectBroker'];
                    }
                }
                return ({headers: response.headers, status, message, result, error: response.error});
            });
    }
    forgotPassBroker (data, locale) {
        return this.apiClient.post(config.brokers.forgotPassBroker, data)
            .then(response => {
                let status = 'error';
                let message = '';
                let result = false;
                if (response.status === 200) {
                    result = true;
                    status = 'success';
                    message = locale.messages['brokerAction.forgotPassBroker'];
                }
                return ({headers: response.headers, status, message, result, error: response.error});
            });
    }
}
