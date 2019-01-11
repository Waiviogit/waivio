export const regexCoordsLatitude = /^(\+|-)?(?:84(?:(?:\.0{1,6})?)|(?:[0-9]|[1-7][0-9]|8[0-4])(?:(?:\.[0-9]{1,6})?))$$/;
export const regexCoordsLongitude = /^(\+|-)?((?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;

export const isCoordinatesValid = (lat, lng) =>
  lat &&
  lng &&
  lat > -85 &&
  lat < 85 &&
  lng > -180 &&
  lng < 180 &&
  String(lat).match(regexCoordsLatitude) &&
  String(lng).match(regexCoordsLongitude);
