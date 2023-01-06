import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

function ObjectFeatures({ features }) {
  return (
    <>
      {!isEmpty(features) && (
        <div>
          <FormattedMessage id="features" defaultMessage="Features" />:
          <div>
            {features?.map(feature => (
              <div key={feature.name}>
                <span className="fw6">{feature.key}: </span>
                <span className="features-value">{feature.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
ObjectFeatures.propTypes = {
  features: PropTypes.arrayOf().isRequired,
};
export default ObjectFeatures;
