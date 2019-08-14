import { createBrowserHistory, createMemoryHistory } from 'history';

const history = typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();

if (typeof window !== 'undefined' && window.analytics) {
  try {
    window.analytics.page({ url: history.location.pathname });
    history.listen(location => {
      window.analytics.page({ url: location.pathname });
    });
  } catch (err) {
    console.log('Logging error', err);
  }
}

export const createHistory = (initialUrl = '/') =>
  typeof window === 'undefined'
    ? createMemoryHistory({ initialEntries: [initialUrl], initialIndex: 0 })
    : createBrowserHistory();

export default history;
