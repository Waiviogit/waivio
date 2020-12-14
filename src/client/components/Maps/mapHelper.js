import fetch from 'isomorphic-fetch';
import { forEach, get } from 'lodash';
// eslint-disable-next-line no-unused-vars
import { handleErrors } from '../../../waivioApi/ApiClient';
import { zoomAndRadiusArray, ZOOM } from '../../../common/constants/map';

export const regexCoordsLatitude = /^([+-])?(?:84(?:(?:\.0{1,6})?)|(?:[0-9]|[1-7][0-9]|8[0-4])(?:(?:\.[0-9]{1,100})?))$$/;
export const regexCoordsLongitude = /^([+-])?((?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,100})?))$/;
// const zeroZoomInPixel = 78206; //  metres/pixel
const earthAraund = 40075016.686;
const INITIAL_RADIUS = 12100000;
export const isCoordinatesValid = (lat, lng) =>
  lat &&
  lng &&
  lat > -85 &&
  lat < 85 &&
  lng > -181 &&
  lng < 181 &&
  String(lat).match(regexCoordsLatitude) &&
  String(lng).match(regexCoordsLongitude);

export const getUserCoordinatesByIpAdress = () =>
  fetch('https://extreme-ip-lookup.com/json/', {
    method: 'GET',
  })
    .then(res => res.json())
    .then(result => result);

export const calculateAreaRadius = (zoom, weight, center) =>
  Math.abs(((earthAraund * Math.cos(center[0])) / 2 ** zoom + 8) * 1.2);

export const getRadius = zoom => Math.floor(INITIAL_RADIUS / 2.01 ** (zoom - 1));

export const getZoom = radius => {
  let zoom;
  if (!radius) return ZOOM;
  if (radius >= zoomAndRadiusArray[0].radius) zoom = zoomAndRadiusArray[0].zoom;
  if (radius <= zoomAndRadiusArray[17].radius) zoom = zoomAndRadiusArray[17].zoom;
  forEach(zoomAndRadiusArray, value => {
    if (radius <= value.radius) {
      zoom = value.zoom;
    }
  });
  return zoom;
};

export const getParsedMap = wobject => {
  const json = wobject.map || get(wobject, ['parent', 'map']);
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const getDistanceBetweenTwoPoints = ({ lat1, long1, lat2, long2 }) => {
  const EarthRadius = 6372795;
  const LatitudeInRadians1 = (lat1 * Math.PI) / 180;
  const LatitudeInRadians2 = (lat2 * Math.PI) / 180;
  const deltaLatitude = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLongitude = ((long2 - long1) * Math.PI) / 180;
  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(LatitudeInRadians1) *
      Math.cos(LatitudeInRadians2) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);
  const c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EarthRadius * c;

  return distance;
};
