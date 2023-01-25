import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import ObjectFeaturesItem from './ObjectFeaturesItem';

const ObjectFeatures = ({ features, isEditMode, wobjPermlink }) => {
  const [showMore, setShowMore] = useState(false);
  const featuresList = showMore ? features?.slice(0, 2) : features;
  const toggleShowMore = () => setShowMore(!showMore);
  const isLongList = features.length > 2;

  useEffect(() => {
    if (isLongList) setShowMore(true);
  }, [wobjPermlink]);

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
            {featuresList?.map(feature => (
              <ObjectFeaturesItem key={feature.key} feature={feature} wobjPermlink={wobjPermlink} />
            ))}
            {isLongList && (
              <a role="presentation" onClick={toggleShowMore}>
                <FormattedMessage
                  id={showMore ? 'show_more_features' : 'show_less_features'}
                  defaultMessage={showMore ? 'View more features' : 'View less features'}
                />
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

ObjectFeatures.propTypes = {
  features: PropTypes.arrayOf().isRequired,
  wobjPermlink: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool.isRequired,
};
export default ObjectFeatures;
