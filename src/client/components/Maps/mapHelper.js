import fetch from 'isomorphic-fetch';
import { forEach, isEmpty } from 'lodash';
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
  new Promise((resolve, reject) => {
    fetch('https://extreme-ip-lookup.com/json/', {
      method: 'GET',
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => {
        resolve(result);
      })
      .catch(error => reject(error));
  });

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
  if (isEmpty(wobject)) return {};
  const json = wobject.map;
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};
