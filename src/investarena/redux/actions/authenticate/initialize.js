import api from '../../../configApi/apiAuthentications';
// import { setLocaleSuccess } from 'redux/actions/localeActions';
import { signInSuccess } from './authenticate';
import { updateHeadersServer } from './headers';

export const initialize = (requestHeaders, res) => {
    return dispatch => {
        if (!requestHeaders) {
            return Promise.resolve();
        }
        return api.initializations.validateToken(requestHeaders)
            .then(({data, headers}) => {
                if (data && headers) {
                    dispatch(updateHeadersServer(res, headers, requestHeaders))
                        .then(() => {
                            // dispatch(setLocaleSuccess(data.language));
                            dispatch(signInSuccess(data));
                        });
                }
            });
    };
};
