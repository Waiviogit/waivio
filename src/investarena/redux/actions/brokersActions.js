import Cookies from 'js-cookie';
import api from '../../configApi/apiResources';
import { authorizeToken, connectPlatform } from './platformActions';
// import { getLanguageState } from 'redux/selectors/languageSelectors';
// import locales from 'locales';
// import { showNotification } from 'redux/actions/ui/notificationActions';
import { singleton } from '../../platform/singletonPlatform';
import { toggleModal } from './modalsActions';

export const AUTHORIZE_BROKER_REQUEST = 'AUTHORIZE_BROKER_REQUEST';
export const AUTHORIZE_BROKER_SUCCESS = 'AUTHORIZE_BROKER_SUCCESS';
export const AUTHORIZE_BROKER_ERROR = 'AUTHORIZE_BROKER_ERROR';
export const REGISTER_BROKER_REQUEST = 'REGISTER_BROKER_REQUEST';
export const REGISTER_BROKER_SUCCESS = 'REGISTER_BROKER_SUCCESS';
export const REGISTER_BROKER_ERROR = 'REGISTER_BROKER_ERROR';
export const FORGOT_PASS_BROKER_REQUEST = 'FORGOT_PASS_BROKER_REQUEST';
export const FORGOT_PASS_BROKER_SUCCESS = 'FORGOT_PASS_BROKER_SUCCESS';
export const FORGOT_PASS_BROKER_ERROR = 'FORGOT_PASS_BROKER_ERROR';
export const DISCONNECT_BROKER_SUCCESS = 'DISCONNECT_BROKER_SUCCESS';
export const DISCONNECT_TOKEN_SUCCESS = 'DISCONNECT_BROKER_SUCCESS';

const localStorageKeys = ['sid', 'stompUser', 'stompPassword', 'um_session', 'broker_id', 'WEBSRV', 'token', 'accounts', 'email'];
const cookiesData = ['platformName'];

export function getBroker () {
    return () => {
        return api.brokers.getBroker()
            .then(({ data }) => {
                return data;
            });
    };
}
export function getBrokers () {
    return () => {
        return api.brokers.getBrokers()
            .then(({ data }) => {
                return data;
            });
    };
}
export function authorizeBroker (data) {
    return (dispatch, getState) => {
        dispatch(authorizeBrokerRequest());
        // return api.brokers.authorizeBroker(data, locales[getLanguageState(getState())])
        return api.brokers.authorizeBroker(data, 'en')
            .then(({status, message, error, broker}) => {
                if (!error && status && message) {
                    if (status === 'success') {
                        dispatch(authorizeBrokerSuccess());
                        dispatch(authorizeToken(broker.token));
                        singleton.closeWebSocketConnection();
                        singleton.platform = data.broker_name;
                        singleton.createWebSocketConnection();
                        dispatch(toggleModal('broker'));
                    } else if (status === 'error') {
                        dispatch(authorizeBrokerError());
                    }
                    // dispatch(showNotification({status, message}));
                } else {
                    dispatch(authorizeBrokerError());
                    // dispatch(showNotification({status: 'error', message: error.toString()}));
                }
            });
    };
}
export function registerBroker (registrationData, authorizationData) {
    return (dispatch, getState) => {
        dispatch(registerBrokerRequest());
        // return api.brokers.registerBroker(registrationData, locales[getLanguageState(getState())])
        return api.brokers.registerBroker(registrationData, 'en')
            .then(({status, message, error}) => {
                if (!error && status && message) {
                    // dispatch(showNotification({status, message}));
                    if (status === 'success') {
                        dispatch(registerBrokerSuccess());
                        setTimeout(() => dispatch(authorizeBroker(authorizationData)), 2000);
                    } else if (status === 'error') {
                        dispatch(registerBrokerError());
                    }
                } else {
                    dispatch(registerBrokerError());
                    // dispatch(showNotification({status: 'error', message: error.toString()}));
                }
            });
    };
}
export function reconnectBroker (data) {
    return (dispatch, getState) => {
        // return api.brokers.reconnectBroker(data, locales[getLanguageState(getState())])
        return api.brokers.reconnectBroker(data, 'en')
            .then(({status, message, result, error}) => {
                if (!error && status && message) {
                    if (result) {
                        dispatch(connectPlatform());
                    } else {
                        // dispatch(showNotification({status: 'error', message}));
                        dispatch(disconnectBroker(true));
                    }
                } else {
                    // dispatch(showNotification({status: 'error', message: error.toString()}));
                }
            });
    };
}
export function disconnectBroker (isReconnect = false) {
    return (dispatch, getState) => {
        localStorageKeys.forEach((data) => {
            localStorage.removeItem(data);
        });
        cookiesData.forEach((data) => {
            Cookies.remove(data);
            localStorage.removeItem(data);
        });
        dispatch(disconnectTokenSuccess());
        singleton.closeWebSocketConnection();
        singleton.platform = 'widgets';
        singleton.createWebSocketConnection();
        // dispatch(showNotification({status: 'success',
        //     message: locales[getLanguageState(getState())].messages['brokerAction.disconnectBrokerSuccess']}));
        if (!isReconnect) {
            dispatch(toggleModal('broker'));
        }
        return {type: DISCONNECT_BROKER_SUCCESS};
    };
}
export function forgotPassBroker (data) {
    return (dispatch, getState) => {
        dispatch(forgotBrokerPassRequest());
      // return api.brokers.forgotPassBroker(data, locales[getLanguageState(getState())])
      return api.brokers.forgotPassBroker(data, 'en')
            .then(({status, message, error}) => {
                if (!error && status && message) {
                    if (status === 'success') {
                        dispatch(forgotBrokerPassSuccess());
                        // dispatch(showNotification({status: status, message: message}));
                    } else {
                        dispatch(forgotBrokerPassError());
                        // dispatch(showNotification({status: 'error', message: error.toString()}));
                    }
                } else {
                    dispatch(forgotBrokerPassError());
                    // dispatch(showNotification({status: 'error', message: error.toString()}));
                }
            });
    };
}

export function authorizeBrokerRequest () {
    return { type: AUTHORIZE_BROKER_REQUEST };
}

export function authorizeBrokerSuccess () {
    return { type: AUTHORIZE_BROKER_SUCCESS };
}

export function authorizeBrokerError () {
    return { type: AUTHORIZE_BROKER_ERROR };
}

export function registerBrokerRequest () {
    return { type: REGISTER_BROKER_REQUEST };
}

export function registerBrokerSuccess () {
    return { type: REGISTER_BROKER_SUCCESS };
}

export function registerBrokerError () {
    return { type: REGISTER_BROKER_ERROR };
}

export function forgotBrokerPassRequest () {
    return { type: FORGOT_PASS_BROKER_REQUEST };
}

export function forgotBrokerPassSuccess () {
    return { type: FORGOT_PASS_BROKER_SUCCESS };
}

export function forgotBrokerPassError () {
    return { type: FORGOT_PASS_BROKER_ERROR };
}

export function disconnectTokenSuccess () {
    return { type: DISCONNECT_TOKEN_SUCCESS };
}
