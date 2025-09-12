import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const ObjectFeaturesItem = ({ feature, wobjPermlink, isSocialGifts }) => {
  const [showMore, setShowMore] = useState(false);
  const toggleShowMore = () => setShowMore(!showMore);
  const stringLengthLimit = 60;
  const isLongValue = feature.value.length > stringLengthLimit;
  const value = showMore ? feature.value?.substring(0, stringLengthLimit) : feature.value;
  const buttonDescriprion = showMore ? 'more' : 'less';

  useEffect(() => {
    if (isLongValue) setShowMore(true);
  }, [wobjPermlink]);

  return isSocialGifts ? (
    <div className="paddingBottom">
      <b>{feature.key}: </b>
      <span className="features-value">{feature.value}</span>
    </div>
  ) : (
    <div>
      <span>{feature.key}: </span>
      <span className="features-value">{value}</span>{' '}
      {isLongValue && (
        <a role="presentation" onClick={toggleShowMore}>
          {<FormattedMessage id={buttonDescriprion} defaultMessage={buttonDescriprion} />}
        </a>
      )}
    </div>
  );
};

ObjectFeaturesItem.propTypes = {
  feature: PropTypes.shape().isRequired,
  wobjPermlink: PropTypes.string.isRequired,
  isSocialGifts: PropTypes.bool,
};
export default ObjectFeaturesItem;
