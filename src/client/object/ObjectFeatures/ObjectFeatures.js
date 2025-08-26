import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import ObjectFeaturesItem from './ObjectFeaturesItem';

const ObjectFeatures = ({ features, isEditMode, wobjPermlink, isSocialGifts }) => {
  const [showMore, setShowMore] = useState(false);
  const sliceNum = isSocialGifts ? 3 : 2;
  const featuresList = showMore ? features?.slice(0, sliceNum) : features;
  const toggleShowMore = () => setShowMore(!showMore);
  const isLongList = features.length > sliceNum;

  useEffect(() => {
    if (isLongList) setShowMore(true);
  }, [wobjPermlink]);
  const renderShowMore = isLongList && (
    <a role="presentation" onClick={toggleShowMore}>
      {isSocialGifts ? (
        <FormattedMessage
          id={showMore ? 'show_more' : 'show_less'}
          defaultMessage={showMore ? 'Show more ' : 'View less'}
        />
      ) : (
        <FormattedMessage
          id={showMore ? 'show_more_features' : 'show_less_features'}
          defaultMessage={showMore ? 'View more features' : 'View less features'}
        />
      )}
    </a>
  );
  const mappedFeatures = featuresList?.map(feature => (
    <ObjectFeaturesItem
      key={feature.key}
      feature={feature}
      wobjPermlink={wobjPermlink}
      isSocialGifts={isSocialGifts}
    />
  ));

  return isSocialGifts ? (
    <div>
      {mappedFeatures}
      {renderShowMore}
    </div>
  ) : (
    <div>
      {!isEmpty(features) && (
        <div>
          {!isEditMode && (
            <div className="CompanyId__title">
              <FormattedMessage id="features" defaultMessage="Features" />:
            </div>
          )}
          <div>
            {mappedFeatures}
            {renderShowMore}
          </div>
        </div>
      )}
    </div>
  );
};

ObjectFeatures.propTypes = {
  features: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  wobjPermlink: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isSocialGifts: PropTypes.bool,
};
export default ObjectFeatures;
