import Cookies from 'js-cookie';

export function parseAuthHeaders (cookies) {
    if (cookies.authHeaders === undefined || cookies.authHeaders.length === 0) {
        return null;
    }
    try {
        return JSON.parse(cookies.authHeaders);
    } catch (e) {
        return null;
    }
}

export function getAuthHeaders () {
    const authHeaders = Cookies.get('authHeaders');
    if (authHeaders === undefined || authHeaders.length === 0) {
        return null;
    }
    try {
        return JSON.parse(authHeaders);
    } catch (e) {
        return null;
    }
}
