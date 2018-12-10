import api from '../../configApi/apiExtra';

export function getSignals (quote) {
    return () => {
        return api.signals.getSignals(quote)
            .then(response => Promise.resolve(response));
    };
}

export function getAllSignals () {
    return api.signals.getAllSignals().then(({ data, error }) => { return { data, error } });
}
