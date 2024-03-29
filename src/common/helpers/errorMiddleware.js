import { find, has } from 'lodash';
import errors from '../constants/errors';
import { notify } from '../../client/app/Notification/notificationActions';

export function parseBlockChainError(error) {
  const errorType = find(errors, e => error.includes(e.fingerprint));

  if (has(errorType, 'message')) {
    return errorType.message;
  }
  const idx = error.indexOf(':');

  if (idx > 0) {
    return error.slice(idx + 1).trim();
  }
  console.error(error);

  return 'Unknown error.';
}

export default function errorMiddleware({ dispatch }) {
  return next => action => {
    if (action.type && action.type.match(/error/i) && action.payload instanceof Error) {
      if (action.payload && action.payload.error_description) {
        // Don't display error message for invalid_grant SDK error
        if (action.payload.error === 'invalid_grant') {
          return next(action);
        }
        dispatch(notify(parseBlockChainError(action.payload.error_description), 'error'));
      }
    }

    return next(action);
  };
}
