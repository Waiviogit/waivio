import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';

function ObjectFeatures({ features, isEditMode }) {
  return (
    <>
      {!isEmpty(features) && (
        <div>
          {!isEditMode && (
            <div className="CompanyId__title">
              <FormattedMessage id="features" defaultMessage="Features" />:
            </div>
          )}
          <div>
            {features?.map(feature => (
              <div key={feature.name}>
                <span>{feature.key}: </span>
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
  isEditMode: PropTypes.bool.isRequired,
};
export default ObjectFeatures;
