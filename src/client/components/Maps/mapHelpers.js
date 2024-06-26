import { forEach, get } from 'lodash';
import { zoomAndRadiusArray, ZOOM } from '../../../common/constants/map';
import { parseJSON } from '../../../common/helpers/parseJSON';

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
  if (!wobject) return null;

  const json = wobject.map || get(wobject, ['parent', 'map']);

  return parseJSON(json);
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

// eslint-disable-next-line consistent-return
export const getCurrentScreenSize = isDesktopModalShow => {
  if (typeof window !== 'undefined') {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    if (isDesktopModalShow) return 'calc(100vh - 110px)';

    if (screenWidth === 375 && screenHeight === 812) {
      return 665;
    } else if (screenWidth === 414 && screenHeight === 736) {
      return 590;
    } else if (screenWidth === 375 && screenHeight === 667) {
      return 520;
    }

    return 600;
  }
};
