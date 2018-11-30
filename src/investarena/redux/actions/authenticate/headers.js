// import _ from 'lodash';
// import axios from 'axios';
import { updateCookieClient, updateCookieServer, deleteCookieClient } from '../../../redux/actions/cookies';
import { authTokenFormat } from '../../../default/tokenFormat';
// import { currentTime } from '../../../helpers/currentTime';
import { getAuthHeaders } from '../../../../server/utils/parseAuthHeaders';

export const UPDATE_HEADERS = 'UPDATE_HEADERS';
// const authHeadersKeys = ['access-token', 'client', 'uid', 'provider'];

export function updateHeadersServer (res, responseHeaders = {}, requestHeaders = {}) {
    return (dispatch) => {
        let headers = requestHeaders;
        if (responseHeaders['access-token'] && responseHeaders.client && responseHeaders.uid && headers.provider) {
            headers = authTokenFormat(responseHeaders);
        }
        dispatch(updateCookieServer(res, 'authHeaders', JSON.stringify(headers)));
        dispatch({ type: UPDATE_HEADERS, payload: headers });
        return Promise.resolve();
    };
}

// export function updateHeaders (headers) {
//     persistHeadersInDeviseStorage(headers);
//     updateServerTime(headers);
// }

// export function deleteAuthHeaders () {
//     _.forEach(authHeadersKeys, (key) => {
//         delete axios.defaults.headers.common[key];
//     });
// }

export function deleteAuthHeadersFromDeviseStorage () {
    deleteCookieClient('authHeaders');
}

// function persistHeadersInDeviseStorage (headers) {
//     if (headers.client && headers.client !== undefined) {
//         setHeadersAxios(headers);
//         headers = authTokenFormat(headers);
//         updateCookieClient('authHeaders', JSON.stringify(headers));
//     }
// }

export function getHeadersFromDeviseStorage () {
    return getAuthHeaders();
}

// function setHeadersAxios (headers) {
//     _.forEach(authHeadersKeys, (key) => {
//         axios.defaults.headers.common[key] = headers[key];
//     });
// }

// function updateServerTime (headers) {
//     if (headers['server-time']) {
//         const currentServerTime = Number(headers['server-time']) * 1000;
//         updateCookieClient('serverTime', currentServerTime);
//         currentTime.currentTime = currentServerTime;
//     }
// }

// export const verifyHeaders = () => {
//     const headers = getAuthHeaders();
//     if (headers) {
//         setHeadersAxios(headers);
//     }
// };
