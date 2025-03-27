export const compareObjectTitle = (isWaivio, objectName, address, siteName) => {
  if (!objectName) return siteName;

  let titleText = `${objectName} `;

  if (address) titleText += ` - ${address} `;

  return titleText;
};

export const compareQuery = query => {
  if (!query) return '';

  return `?${query}`;
};

export default null;
