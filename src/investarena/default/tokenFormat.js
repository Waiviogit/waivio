export function authTokenFormat(header) {
  return {
    'access-token': header['access-token'],
    client: header.client,
    uid: header.uid,
    provider: header.provider,
  };
}

export function oAuthTokenFormat(params) {
  return {
    'access-token': params.auth_token,
    client: params.client_id,
    uid: params.uid,
    provider: params.provider,
  };
}
export function resetPasswordFormat(params) {
  return {
    'access-token': params.token,
    client: params.client_id,
    uid: params.uid,
    provider: params.provider,
  };
}
