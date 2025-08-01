import { forEach, get } from 'lodash';
import { ZOOM, zoomAndRadiusArray } from '../../../common/constants/map';
import { parseJSON } from '../../../common/helpers/parseJSON';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { calculateMana, dHive } from '../../vendor/steemitHelpers';

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

export const formBusinessObjects = ({ object, waivio_tags, listAssociations }) => ({
  name: object.displayName.text,
  googleTypes: object.types,
  address: object.formattedAddress,
  ...(object.editorialSummary && {
    descriptions: [object.editorialSummary.text],
  }),
  ...(object.location && {
    latitude: object.location.latitude,
    longitude: object.location.longitude,
  }),
  ...(object.regularOpeningHours && {
    workingHours: object.regularOpeningHours.weekdayDescriptions.join(',\n'),
  }),
  ...(object.websiteUri && { websites: [object.websiteUri] }),
  ...(object.internationalPhoneNumber && {
    phone: object.internationalPhoneNumber,
  }),
  ...(object.rating && {
    features: [
      {
        key: 'Overall Rating',
        value: [object.rating],
      },
    ],
  }),
  companyIds: [{ companyIdType: 'googleMaps', companyId: object.id }],
  ...(object.reviews?.length && {
    reviews: object.reviews.map(el => el?.text?.text).filter(el => !!el),
  }),
  waivio_tags,
  listAssociations,
});

export const getVotingInfo = async (isGuest, authUserName, setUsersState) => {
  if (isGuest) {
    const guestUserMana = await ApiClient.getGuestUserMana(authUserName);

    setUsersState({ guestMana: guestUserMana.result });
  } else {
    const [acc] = await dHive.database.getAccounts([authUserName]);
    const rc = await dHive.rc.getRCMana(authUserName, acc);
    const waivVotingMana = await ApiClient.getWaivVoteMana(authUserName, acc);
    const waivPowerBar = waivVotingMana ? calculateMana(waivVotingMana) : null;
    const resourceCredits = rc.percentage * 0.01 || 0;

    setUsersState({
      waivPowerMana: waivPowerBar?.votingPower ? waivPowerBar.votingPower : 100,
      resourceCredits,
    });
  }
};

export const handleArrayToFile = array => {
  const jsonData = JSON.stringify(array);

  return new Blob([jsonData], { type: 'application/json' });

  // return new File([fileBlob], "data.json", {type: 'application/json'});
};
export const restaurantGoogleTypes = [
  'restaurant',
  'cafe',
  'bar',
  'bakery',
  'pub',
  'bistro',
  'coffee_shop',
  'diner',
  'tavern',
  'cocktail_lounge',
];
export const placeGoogleTypes = [
  'airport',
  'amusement_park',
  'aquarium',
  'art_gallery',
  'auditorium',
  'beach',
  'botanical_garden',
  'bowling_alley',
  'bus_station',
  'campground',
  'camping_cabin',
  'casino',
  'cemetery',
  'church',
  'city_hall',
  'community_center',
  'concert_hall',
  'courthouse',
  'cultural_landmark',
  'embassy',
  'event_venue',
  'ferry_terminal',
  'fire_station',
  'garden',
  'government_office',
  'hiking_area',
  'hindu_temple',
  'historical_landmark',
  'historical_place',
  'hospital',
  'library',
  'light_rail_station',
  'local_government_office',
  'monument',
  'mosque',
  'movie_theater',
  'museum',
  'national_park',
  'natural_feature',
  'night_club',
  'observation_deck',
  'opera_house',
  'park',
  'parking',
  'philharmonic_hall',
  'picnic_ground',
  'plaza',
  'police',
  'post_office',
  'primary_school',
  'public_bath',
  'public_bathroom',
  'rv_park',
  'school',
  'sculpture',
  'secondary_school',
  'skateboard_park',
  'stadium',
  'state_park',
  'subway_station',
  'synagogue',
  'tourist_attraction',
  'train_station',
  'transit_station',
  'university',
  'visitor_center',
  'wildlife_park',
  'wildlife_refuge',
  'zoo',
];
export const supportedGoogleTypes = [
  { label: 'Accounting', value: 'accounting' },
  { label: 'Airport', value: 'airport' },
  { label: 'Amusement park', value: 'amusement_park' },
  { label: 'Aquarium', value: 'aquarium' },
  { label: 'Art gallery', value: 'art_gallery' },
  { label: 'ATM', value: 'atm' },
  { label: 'Auditorium', value: 'auditorium' },
  { label: 'Bakery', value: 'bakery' },
  { label: 'Bank', value: 'bank' },
  { label: 'Bar', value: 'bar' },
  { label: 'Beach', value: 'beach' },
  { label: 'Beauty salon', value: 'beauty_salon' },
  { label: 'Bicycle store', value: 'bicycle_store' },
  { label: 'Book store', value: 'book_store' },
  { label: 'Botanical Garden', value: 'botanical_garden' },
  { label: 'Bowling alley', value: 'bowling_alley' },
  { label: 'Bus station', value: 'bus_station' },
  { label: 'Cafe', value: 'cafe' },
  { label: 'Campground', value: 'campground' },
  { label: 'Camping Cabin', value: 'camping_cabin' },
  { label: 'Car dealer', value: 'car_dealer' },
  { label: 'Car rental', value: 'car_rental' },
  { label: 'Car repair', value: 'car_repair' },
  { label: 'Car wash', value: 'car_wash' },
  { label: 'Casino', value: 'casino' },
  { label: 'Cemetery', value: 'cemetery' },
  { label: 'Church', value: 'church' },
  { label: 'City hall', value: 'city_hall' },
  { label: 'Clothing store', value: 'clothing_store' },
  { label: 'Community Center', value: 'community_center' },
  { label: 'Concert Hall', value: 'concert_hall' },
  { label: 'Convenience store', value: 'convenience_store' },
  { label: 'Courthouse', value: 'courthouse' },
  { label: 'Cultural Landmark', value: 'cultural_landmark' },
  { label: 'Dentist', value: 'dentist' },
  { label: 'Department store', value: 'department_store' },
  { label: 'Doctor', value: 'doctor' },
  { label: 'Drugstore', value: 'drugstore' },
  { label: 'Electrician', value: 'electrician' },
  { label: 'Electronics store', value: 'electronics_store' },
  { label: 'Embassy', value: 'embassy' },
  { label: 'Event Venue', value: 'event_venue' },
  { label: 'Fire station', value: 'fire_station' },
  { label: 'Florist', value: 'florist' },
  { label: 'Funeral home', value: 'funeral_home' },
  { label: 'Furniture store', value: 'furniture_store' },
  { label: 'Garden', value: 'garden' },
  { label: 'Gas station', value: 'gas_station' },
  { label: 'Government Office', value: 'government_office' },
  { label: 'Gym', value: 'gym' },
  { label: 'Hair care', value: 'hair_care' },
  { label: 'Hardware store', value: 'hardware_store' },
  { label: 'Hiking Area', value: 'hiking_area' },
  { label: 'Hindu temple', value: 'hindu_temple' },
  { label: 'Historical Landmark', value: 'historical_landmark' },
  { label: 'Historical Place', value: 'historical_place' },
  { label: 'Home goods store', value: 'home_goods_store' },
  { label: 'Hospital', value: 'hospital' },
  { label: 'Insurance agency', value: 'insurance_agency' },
  { label: 'Jewelry store', value: 'jewelry_store' },
  { label: 'Laundry', value: 'laundry' },
  { label: 'Lawyer', value: 'lawyer' },
  { label: 'Library', value: 'library' },
  { label: 'Light rail station', value: 'light_rail_station' },
  { label: 'Liquor store', value: 'liquor_store' },
  { label: 'Local government office', value: 'local_government_office' },
  { label: 'Locksmith', value: 'locksmith' },
  { label: 'Lodging', value: 'lodging' },
  { label: 'Meal delivery', value: 'meal_delivery' },
  { label: 'Meal takeaway', value: 'meal_takeaway' },
  { label: 'Monument', value: 'monument' },
  { label: 'Mosque', value: 'mosque' },
  { label: 'Movie rental', value: 'movie_rental' },
  { label: 'Movie theater', value: 'movie_theater' },
  { label: 'Moving company', value: 'moving_company' },
  { label: 'Museum', value: 'museum' },
  { label: 'National Park', value: 'national_park' },
  { label: 'Night club', value: 'night_club' },
  { label: 'Observation Deck', value: 'observation_deck' },
  { label: 'Opera House', value: 'opera_house' },
  { label: 'Painter', value: 'painter' },
  { label: 'Park', value: 'park' },
  { label: 'Parking', value: 'parking' },
  { label: 'Pet store', value: 'pet_store' },
  { label: 'Pharmacy', value: 'pharmacy' },
  { label: 'Philharmonic Hall', value: 'philharmonic_hall' },
  { label: 'Picnic Ground', value: 'picnic_ground' },
  { label: 'Physiotherapist', value: 'physiotherapist' },
  { label: 'Plaza', value: 'plaza' },
  { label: 'Plumber', value: 'plumber' },
  { label: 'Police', value: 'police' },
  { label: 'Post office', value: 'post_office' },
  { label: 'Primary school', value: 'primary_school' },
  { label: 'Public Bath', value: 'public_bath' },
  { label: 'Public Bathroom', value: 'public_bathroom' },
  { label: 'Real estate agency', value: 'real_estate_agency' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Roofing contractor', value: 'roofing_contractor' },
  { label: 'RV park', value: 'rv_park' },
  { label: 'School', value: 'school' },
  { label: 'Sculpture', value: 'sculpture' },
  { label: 'Secondary school', value: 'secondary_school' },
  { label: 'Shoe store', value: 'shoe_store' },
  { label: 'Shopping mall', value: 'shopping_mall' },
  { label: 'Skateboard Park', value: 'skateboard_park' },
  { label: 'Spa', value: 'spa' },
  { label: 'Stadium', value: 'stadium' },
  { label: 'State Park', value: 'state_park' },
  { label: 'Storage', value: 'storage' },
  { label: 'Store', value: 'store' },
  { label: 'Subway station', value: 'subway_station' },
  { label: 'Supermarket', value: 'supermarket' },
  { label: 'Synagogue', value: 'synagogue' },
  { label: 'Taxi stand', value: 'taxi_stand' },
  { label: 'Tourist attraction', value: 'tourist_attraction' },
  { label: 'Train station', value: 'train_station' },
  { label: 'Transit station', value: 'transit_station' },
  { label: 'Travel agency', value: 'travel_agency' },
  { label: 'University', value: 'university' },
  { label: 'Veterinary care', value: 'veterinary_care' },
  { label: 'Visitor Center', value: 'visitor_center' },
  { label: 'Wildlife Park', value: 'wildlife_park' },
  { label: 'Wildlife Refuge', value: 'wildlife_refuge' },
  { label: 'Zoo', value: 'zoo' },
];
