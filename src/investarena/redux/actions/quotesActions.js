export const UPDATE_QUOTES = 'UPDATE_QUOTES';

export function updateQuotes(quotes) {
  return { type: UPDATE_QUOTES, payload: quotes };
}
