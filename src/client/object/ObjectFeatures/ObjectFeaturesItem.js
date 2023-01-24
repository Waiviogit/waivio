import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const ObjectFeaturesItem = ({ feature, wobjPermlink }) => {
  const [showMore, setShowMore] = useState(false);
  const toggleShowMore = () => setShowMore(!showMore);
  const stringLengthLimit = 60;

  useEffect(() => {
    if (feature.value.length > stringLengthLimit) setShowMore(true);
  }, [wobjPermlink]);

  return (
    <div>
      <span>{feature.key}: </span>
      <span className="features-value">
        {showMore ? feature.value.substring(0, stringLengthLimit) : feature.value}
      </span>{' '}
      {feature.value.length > stringLengthLimit && (
        <a role="presentation" onClick={toggleShowMore}>
          <FormattedMessage
            id={showMore ? 'more' : 'less'}
            defaultMessage={showMore ? 'more' : 'less'}
          />
        </a>
      )}
    </div>
  );
};

ObjectFeaturesItem.propTypes = {
  feature: PropTypes.shape().isRequired,
  wobjPermlink: PropTypes.string.isRequired,
};
export default ObjectFeaturesItem;
