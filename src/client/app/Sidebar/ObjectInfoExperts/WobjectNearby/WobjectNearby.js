import { Icon } from 'antd';
import { size } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import WeightTag from '../../../../components/WeightTag';
import ObjectCard from '../../../../components/Sidebar/ObjectCard';

import './WobjectNearby.less';
import RightSidebarLoading from '../../RightSidebarLoading';

const WobjectNearby = ({
  wobject,
  intl,
  isCenterContent,
  getNearbyObjects,
  nearbyObjects,
  history,
  setFiltersAndLoad,
  activeFilters,
  nearbyObjectsIsLoading,
}) => {
  useEffect(() => {
    getNearbyObjects(wobject.author_permlink);
  }, [wobject.author_permlink]);

  const handleRedirect = () => {
    const map = JSON.parse(wobject.map);

    const filters = {
      ...activeFilters,
      map: {
        zoom: 12,
        radius: 20000,
        coordinates: [map.latitude, map.longitude],
      },
    };

    setFiltersAndLoad(filters);
    history.push(
      `/discover-objects/${wobject.object_type}?mapX=${map.latitude}&mapY=${map.longitude}&zoom=${filters.map.zoom}&radius=${filters.map.radius}`,
    );
  };

  const redirectOnTitleClick = () => {
    if (isCenterContent) handleRedirect();
  };
  let renderObjects = null;

  if (nearbyObjectsIsLoading) {
    renderObjects = <RightSidebarLoading id="RightSidebarLoading" />;
  } else if (size(nearbyObjects) && !nearbyObjectsIsLoading) {
    renderObjects = (
      <div className="SidebarContentBlock">
        <div className="SidebarContentBlock__title" onClick={redirectOnTitleClick}>
          {!isCenterContent && (
            <span className="SidebarContentBlock__icon">
              <Icon type="environment-o" />
            </span>
          )}
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
        {!isCenterContent && (
          <div className="ObjectsNearby__more">
            <span onClick={handleRedirect}>
              {intl.formatMessage({ id: 'show_more', defaultMessage: 'Show more' })}
            </span>
          </div>
        )}
      </div>
    );
  }

  return renderObjects;
};

WobjectNearby.propTypes = {
  isCenterContent: PropTypes.bool,
  nearbyObjects: PropTypes.shape(),
  activeFilters: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  getNearbyObjects: PropTypes.func.isRequired,
  setFiltersAndLoad: PropTypes.func.isRequired,
  nearbyObjectsIsLoading: PropTypes.shape().isRequired,
};

WobjectNearby.defaultProps = {
  activeFilters: {},
  nearbyObjects: [],
  isCenterContent: false,
};

export default withRouter(injectIntl(WobjectNearby));
