export const UPDATE_QUOTES_SETTINGS = 'UPDATE_QUOTES_SETTINGS';

export function updateQuotesSettings(quotesSettings) {
  return { type: UPDATE_QUOTES_SETTINGS, payload: quotesSettings };
}
