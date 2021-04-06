import { createBrowserHistory, createMemoryHistory } from 'history';

const history = typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();

export const createHistory = (initialUrl = '/') =>
  typeof window === 'undefined'
    ? createMemoryHistory({ initialEntries: [initialUrl], initialIndex: 0 })
    : createBrowserHistory();

export default history;
