import _ from 'lodash';

export function setItemTabs(tab) {
  const localStorageTabs = localStorage.getItem('tabs');
  const localStorageTabsAfter = localStorageTabs
    ? { ...JSON.parse(localStorageTabs), [Object.keys(tab)]: Object.values(tab)[0] }
    : { [Object.keys(tab)]: Object.values(tab)[0] };
  localStorage.setItem('tabs', JSON.stringify(localStorageTabsAfter));
}
export function getItemTabs(nameTab) {
  return localStorage.getItem('tabs') && JSON.parse(localStorage.getItem('tabs'))[nameTab]
    ? +JSON.parse(localStorage.getItem('tabs'))[nameTab]
    : null;
}

export function setOptionalBlockState(item, isOpen) {
  localStorage.setItem(item, JSON.stringify(isOpen));
}
export function getOptionalBlockState(item) {
  const isOpen = localStorage.getItem(item);
  return isOpen !== null ? JSON.parse(isOpen) : true;
}
export function setFavoritesLS(quoteName) {
  const localStorageFavorite = localStorage.getItem('favoriteQuotes') || '[]';
  if (localStorageFavorite) {
    let localStorageFavoriteParsed = JSON.parse(localStorageFavorite);
    if (!_.some(localStorageFavoriteParsed, item => item === quoteName)) {
      localStorageFavoriteParsed.push(quoteName);
      localStorage.setItem('favoriteQuotes', JSON.stringify(localStorageFavoriteParsed));
    } else {
      localStorageFavoriteParsed = _.pull(localStorageFavoriteParsed, quoteName);
      localStorage.setItem('favoriteQuotes', JSON.stringify(localStorageFavoriteParsed));
    }
  }
}
/**
 *
 * @param targetName: string - name of component or page where we want to save viewMode state
 * @param viewModeValue: oneOf(['list', 'cards'])
 */
export function setViewMode(targetName, viewModeValue) {
  const viewModeCurrent = localStorage.getItem('viewMode');
  const viewModeUpdated = viewModeCurrent
    ? { ...JSON.parse(viewModeCurrent), [targetName]: viewModeValue }
    : { [targetName]: viewModeValue };
  localStorage.setItem('viewMode', JSON.stringify(viewModeUpdated));
}
export function getViewMode(targetName) {
  const viewMode = localStorage.getItem('viewMode');
  return viewMode ? JSON.parse(viewMode)[targetName] : null;
}
