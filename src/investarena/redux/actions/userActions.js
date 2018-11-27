import { AUTHORIZE_TOKEN_SUCCESS } from './platformActions';

export function authorizeTokenSuccess(data) {
  return { type: AUTHORIZE_TOKEN_SUCCESS, payload: data };
}
