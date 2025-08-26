import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const MapObjectTypes = ({ types }) => (
  <React.Fragment>
    <div className="Department__title">
      <FormattedMessage id="map_items_types" formattedMessage="Types of map items" />:{' '}
    </div>
    {types?.map(t => (
      <React.Fragment key={`mapObjTypes-${t}`}>
        <span>{t}</span>
      </React.Fragment>
    ))}
  </React.Fragment>
);

MapObjectTypes.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
export default MapObjectTypes;
