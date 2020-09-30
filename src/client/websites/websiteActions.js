import { createAsyncActionType } from '../helpers/stateHelpers';
import { checkAvailable, createWebsite, getDomainList } from '../../waivioApi/ApiClient';

export const GET_PARENT_DOMAIN = createAsyncActionType('@website/GET_PARENT_DOMAIN');

export const getParentDomainList = () => ({
  type: GET_PARENT_DOMAIN.ACTION,
  payload: { promise: getDomainList().then(r => r) },
});

export const CREATE_NEW_WEBSITE = createAsyncActionType('@website/CREATE_NEW_WEBSITE');

export const createNewWebsite = () => ({
  type: CREATE_NEW_WEBSITE.ACTION,
  promise: createWebsite(),
});

export const CHECK_AVAILABLE_DOMAIN = createAsyncActionType('@website/CHECK_AVAILABLE_DOMAIN');

export const checkAvailableDomain = (name, parent) => ({
  type: CHECK_AVAILABLE_DOMAIN.ACTION,
  promise: checkAvailable(name, parent)
    .then(r => r)
    .catch(e => e),
});
