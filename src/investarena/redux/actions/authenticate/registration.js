import api from '../../../configApi/apiAuthentications';
import apiInformation from '../../../configApi/apiExtra';
// import { getLanguageState } from 'redux/selectors/languageSelectors';
// import locales from 'locales';
// import { showNotification } from 'redux/actions/ui/notificationActions';

export const REGISTRATION_REQUEST = 'REGISTRATION_REQUEST';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_ERROR = 'REGISTRATION_ERROR';

export function registration (data) {
    return (dispatch, getState) => {
        dispatch(registrationRequest());
        return api.registrations.registration(data)
            .then(({error}) => {
                if (!error) {
                    dispatch(registrationSuccess());
                    // dispatch(showNotification({status: 'success',
                    //     message: locales[getLanguageState(getState())].messages['registrationAction.registration']}));
                } else {
                    dispatch(registrationError());
                    // dispatch(showNotification({status: 'error', message: error}));
                    return error;
                }
            });
    };
}

export function getCountryCode () {
    return apiInformation.information.getCountryCode().then((data) => data);
}

export function registrationRequest () {
    return { type: REGISTRATION_REQUEST };
}

export function registrationSuccess () {
    return { type: REGISTRATION_SUCCESS };
}

export function registrationError () {
    return { type: REGISTRATION_ERROR };
}
