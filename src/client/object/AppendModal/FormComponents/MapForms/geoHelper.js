import { isEmpty, reduce } from 'lodash';

export const ZOOM_DISTANCE = [
  [15, 1268],
  [14, 2537],
  [13, 5074],
  [12, 10147],
  [11, 20294],
  [10, 40589],
  [9, 81176],
  [8, 162352],
  [7, 324700],
  [6, 649357],
  [5, 1298407],
  [4, 2594265],
  [3, 5168868],
  [2, 10171255],
];

export const EARTH_RADIUS_M = 6371000;

export const DEFAULT_MAP_VIEW = {
  center: [35.481914795718964, -18.437916571407385],
  zoom: 2,
};

export const getCenterAndZoomOnSeveralBox = (mapCoordinates = []) => {
  if (isEmpty(mapCoordinates)) return DEFAULT_MAP_VIEW;

  const { longitude, latitude } = reduce(
    mapCoordinates,
    (acc, el) => {
      acc.longitude.push(el.topPoint[0], el.bottomPoint[0]);
      acc.latitude.push(el.topPoint[1], el.bottomPoint[1]);

      return acc;
    },
    { longitude: [], latitude: [] },
  );

  longitude.sort((a, b) => b - a);
  latitude.sort((a, b) => b - a);

  const center = [
    mediumPoint(latitude[0], latitude[longitude.length - 1]),
    mediumPoint(longitude[0], longitude[longitude.length - 1]),
  ];

  const distance = distanceInMBetweenEarthCoordinates(
    [longitude[longitude.length - 1], latitude[0]],
    [longitude[0], latitude[longitude.length - 1]],
  );
  const zoom = getMapZoomByDistance(distance);

  return { center, zoom };
};

const distanceInMBetweenEarthCoordinates = ([lon1, lat1], [lon2, lat2]) => {
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_M * c);
};

const degreesToRadians = degrees => (degrees * Math.PI) / 180;

const mediumPoint = (point1, point2) => (point1 + point2) / 2;

const getMapZoomByDistance = distance => {
  let zoom = 3;

  for (let i = 0; i < ZOOM_DISTANCE.length; i++) {
    if (distance < ZOOM_DISTANCE[i][1]) {
      [zoom] = ZOOM_DISTANCE[i];
      break;
    }
  }

  return zoom;
};
