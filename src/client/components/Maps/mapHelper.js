import fetch from 'isomorphic-fetch';
import { handleErrors } from '../../../waivioApi/ApiClient';

export const regexCoordsLatitude = /^(\+|-)?(?:84(?:(?:\.0{1,6})?)|(?:[0-9]|[1-7][0-9]|8[0-4])(?:(?:\.[0-9]{1,100})?))$$/;
export const regexCoordsLongitude = /^(\+|-)?((?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,100})?))$/;
// const zeroZoomInPixel = 78206; //  metres/pixel
const earthAraund = 40075016.686;
export const isCoordinatesValid = (lat, lng) =>
  lat &&
  lng &&
  lat > -85 &&
  lat < 85 &&
  lng > -180 &&
  lng < 180 &&
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
  Math.abs(((earthAraund * Math.cos(center[0])) / 2 ** zoom + 8)*1.2);
