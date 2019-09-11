import Cookies from 'js-cookie';
import { message } from 'antd';
import api from '../../configApi/apiResources';
import { authorizeToken, connectPlatform } from './platformActions';
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

const localStorageKeys = [
  'sid',
  'stompUser',
  'stompPassword',
  'um_session',
  'broker_id',
  'WEBSRV',
  'token',
  'accounts',
  'email',
];
const cookiesData = ['platformName'];

export function authorizeBrokerRequest() {
  return { type: AUTHORIZE_BROKER_REQUEST };
}

export function authorizeBrokerSuccess() {
  return { type: AUTHORIZE_BROKER_SUCCESS };
}

export function authorizeBrokerError() {
  return { type: AUTHORIZE_BROKER_ERROR };
}

export function registerBrokerRequest() {
  return { type: REGISTER_BROKER_REQUEST };
}

export function registerBrokerSuccess() {
  return { type: REGISTER_BROKER_SUCCESS };
}

export function registerBrokerError() {
  return { type: REGISTER_BROKER_ERROR };
}

export function forgotBrokerPassRequest() {
  return { type: FORGOT_PASS_BROKER_REQUEST };
}

export function forgotBrokerPassSuccess() {
  return { type: FORGOT_PASS_BROKER_SUCCESS };
}

export function forgotBrokerPassError() {
  return { type: FORGOT_PASS_BROKER_ERROR };
}

export function disconnectTokenSuccess() {
  return { type: DISCONNECT_TOKEN_SUCCESS };
}

export function authorizeBroker(data) {
  return dispatch => {
    dispatch(authorizeBrokerRequest());
    return api.brokers.authorizeBroker(data, 'en-UK').then(({ status, error, broker }) => {
      if (!error && status) {
        if (status === 'success') {
          dispatch(authorizeBrokerSuccess());
          dispatch(authorizeToken(broker.token));
          singleton.closeWebSocketConnection();
          singleton.platform = data.platform;
          singleton.createWebSocketConnection();
          dispatch(toggleModal('broker'));
        } else if (status === 'error') {
          dispatch(authorizeBrokerError());
        }
        message.success('Successfully connected to broker');
      } else {
        dispatch(authorizeBrokerError());
        message.error(error.toString());
      }
    });
  };
}
export function registerBroker(registrationData) {
  return dispatch => {
    dispatch(registerBrokerRequest());
    return api.brokers.registerBroker(registrationData, 'en-UK').then(({ status, error }) => {
      if (!error && status) {
        message.success('Registration success');
        if (status === 'success') {
          dispatch(registerBrokerSuccess());
          setTimeout(() => {
            dispatch(authorizeBroker(registrationData));
          }, 2000);
        } else if (status === 'error') {
          dispatch(registerBrokerError());
        }
      } else {
        dispatch(registerBrokerError());
        message.error(error.toString());
      }
    });
  };
}
export function disconnectBroker(isReconnect = false) {
  return dispatch => {
    localStorageKeys.forEach(data => {
      localStorage.removeItem(data);
    });
    cookiesData.forEach(data => {
      Cookies.remove(data);
      localStorage.removeItem(data);
    });
    dispatch(disconnectTokenSuccess());
    singleton.closeWebSocketConnection();
    singleton.platform = 'widgets';
    singleton.createWebSocketConnection();
    message.success('Broker successfully disconnected');
    if (!isReconnect) {
      dispatch(toggleModal('broker'));
    }
    return { type: DISCONNECT_BROKER_SUCCESS };
  };
}
export function reconnectBroker(data) {
  return dispatch =>
    api.brokers.reconnectBroker(data).then(({ status, resMessage, result, error }) => {
      if (!error && status && resMessage) {
        if (result) {
          dispatch(connectPlatform());
        } else {
          message.error(resMessage);
          dispatch(disconnectBroker(true));
        }
      } else {
        message.error(error.toString());
      }
    });
}
export function forgotPassBroker(data) {
  return dispatch => {
    dispatch(forgotBrokerPassRequest());
    return api.brokers.forgotPassBroker(data, 'en').then(({ status, error }) => {
      if (!error && status && messageresp) {
        if (status === 'success') {
          dispatch(forgotBrokerPassSuccess());
          message.success('Password successfully send to your email');
        } else {
          dispatch(forgotBrokerPassError());
          message.error(error.toString());
        }
      } else {
        dispatch(forgotBrokerPassError());
        message.error(error.toString());
      }
    });
  };
}


