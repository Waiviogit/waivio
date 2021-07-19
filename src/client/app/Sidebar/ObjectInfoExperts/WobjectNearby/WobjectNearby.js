import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import WeightTag from '../../../../components/WeightTag';
import ObjectCard from '../../../../components/Sidebar/ObjectCard';

import './WobjectNearby.less';

const WobjectNearby = ({ wobject, intl, isCenterContent, getNearbyObjects, nearbyObjects }) => {
  useEffect(() => {
    getNearbyObjects(wobject.author_permlink);
  }, [wobject.author_permlink]);

  return (
    <div className="SidebarContentBlock" data-test="objectsRelatedComponent">
      <div className="SidebarContentBlock__title">
        {!isCenterContent && <i className="iconfont icon-link SidebarContentBlock__icon" />}{' '}
        {intl.formatMessage({ id: 'nearby_to_object', defaultMessage: 'Nearby' })}
      </div>
      <div className="SidebarContentBlock__content">
        {nearbyObjects.map(item => (
          <ObjectCard
            key={item.author_permlink}
            wobject={item}
            showFollow={false}
            alt={<WeightTag weight={item.weight} />}
            isNewWindow={false}
            id="ObjectCard"
          />
        ))}
      </div>
    </div>
  );
};

WobjectNearby.propTypes = {
  isCenterContent: PropTypes.bool,
  nearbyObjects: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  getNearbyObjects: PropTypes.func.isRequired,
};

WobjectNearby.defaultProps = {
  nearbyObjects: [],
  isCenterContent: false,
};

export default injectIntl(WobjectNearby);
