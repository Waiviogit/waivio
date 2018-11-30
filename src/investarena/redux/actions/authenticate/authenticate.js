import Cookies from 'js-cookie';
import wakeUp from '../../../wakeUp';
import { webSocketClient } from '../../../webSocketClient';
import { connectPlatform, disconnectPlatform } from '../../../redux/actions/platformActions';
import { deleteAuthHeaders, getHeadersFromDeviseStorage, deleteAuthHeadersFromDeviseStorage } from './headers';
import { getConnectionState } from '../../../redux/selectors/userSelectors';
import api from '../../../configApi/apiAuthentications';
import { currentTime } from '../../../helpers/currentTime';
// import { getLanguageState } from '../../../redux/selectors/languageSelectors';
// import { replace } from 'react-router-redux';
// import { saveReferrer } from 'redux/actions/ui/referrersActions';
// import { setLocaleSuccess } from 'redux/actions/localeActions';
// import { showNotification } from 'redux/actions/ui/notificationActions';

export const SIGN_IN_REQUEST = 'SIGN_IN_REQUEST';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_IN_ERROR = 'SIGN_IN_ERROR';
export const SIGN_OUT_REQUEST = 'SIGN_OUT_REQUEST';
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';
export const SIGN_OUT_ERROR = 'SIGN_OUT_ERROR';
export const SIGN_OUT_ON_UNAUTHORIZED = 'SIGN_OUT_ON_UNAUTHORIZED';

export function signIn (email, password) {
    return (dispatch, getState) => {
        dispatch(saveReferrer(document.referrer));
        dispatch(signInRequest());
        return api.authentications.signIn(email, password, document.referrer)
            .then(({data, headers, error}) => {
                if (data && headers) {
                    const cookieLocale = Cookies.get('locale');
                    const userLocale = data.language;
                    if ((cookieLocale === 'ar' && userLocale !== 'ar') || (cookieLocale !== 'ar' && userLocale === 'ar')) {
                        window.location.reload();
                    } else {
                        // dispatch(setLocaleSuccess(data.language));
                        dispatch(connectPlatform());
                        dispatch(signInSuccess(data));
                        webSocketClient.initialize(dispatch, headers);
                        wakeUp(dispatch, getState);
                        currentTime.startCountdown();
                        // if (!getState().routing.locationBeforeTransitions.pathname.includes('posts')) {
                        //     dispatch(replace('/'));
                        // }
                    }
                } else {
                    dispatch(signInError());
                    // dispatch(showNotification({status: 'error', message: error.toString()}));
                }
            });
    };
}

export function signOut () {
    return (dispatch, getState) => {
        dispatch(signOutRequest());
        return api.authentications.signOut(getHeadersFromDeviseStorage())
            .then(({error}) => {
                if (!error) {
                    signOutProcess(dispatch, getState);
                } else {
                    dispatch(signOutError());
                    // dispatch(replace('/sign_in'));
                    // dispatch(showNotification({status: 'error', message: error.toString()}));
                }
            });
    };
}

export function keepAliveInterval (callback) {
    return (dispatch) => {
        callback && dispatch(callback());
        setInterval(() => {
            callback && dispatch(callback());
        }, 1 * 60 * 1000);
    };
}

export function keepAlive () {
    return (dispatch, getState) => {
        if (getConnectionState(getState())) {
            return api.authentications.keepAlive(getHeadersFromDeviseStorage()).then(({error}) => {
                if (error && error.statusCode === 401) {
                    dispatch(signOutOnUnauthorized());
                }
            });
        }
    };
}

function signOutProcess (dispatch, getState) {
    deleteAuthHeaders();
    deleteAuthHeadersFromDeviseStorage();
    Cookies.set('locale', getLanguageState(getState()));
    disconnectPlatform();
    webSocketClient.closeWebSocketConnection();
    // dispatch(signOutSuccess());
    // dispatch(replace('/sign_in'));
}

export function signInRequest () {
    return { type: SIGN_IN_REQUEST };
}

export function signInSuccess (data) {
    return { type: SIGN_IN_SUCCESS, payload: data };
}

export function signInError () {
    return { type: SIGN_IN_ERROR };
}

export function signOutRequest () {
    return { type: SIGN_OUT_REQUEST };
}

export function signOutSuccess () {
    return { type: SIGN_OUT_SUCCESS };
}

export function signOutError () {
    return { type: SIGN_OUT_ERROR };
}

export function signOutOnUnauthorized () {
    return { type: SIGN_OUT_ON_UNAUTHORIZED };
}
