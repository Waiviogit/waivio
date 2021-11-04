import React from 'react';
import PropTypes from 'prop-types';

const UserLocation = props => (
  <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="49.5" fill={props.markerColor} stroke="white" fillOpacity="0.6" />
    <circle cx="50" cy="50" r="29" fill={'#000000'} />
    <circle cx="50" cy="50" r="30" fill={props.markerColor} fillOpacity="0.9" />
  </svg>
);

UserLocation.propTypes = {
  markerColor: PropTypes.string.isRequired,
};
export default UserLocation;
