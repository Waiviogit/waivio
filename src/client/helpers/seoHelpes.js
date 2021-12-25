export const compareObjectTitle = (isWaivio, objectName, address, siteName) => {
  if (!objectName) return siteName;

  let titleText = `${objectName} - `;

  if (address) titleText += `${address} - `;

  return titleText + siteName;
};

export default null;
