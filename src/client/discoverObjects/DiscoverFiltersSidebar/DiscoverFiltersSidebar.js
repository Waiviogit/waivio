import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, memoize } from 'lodash';
import { isNeedFilters } from '../helper';
import { getAvailableFilters, getUserLocation, getHasMap } from '../../reducers';
import { getCoordinates } from '../../user/userActions';
import MapWrap from '../../components/Maps/MapWrap/MapWrap';
import FiltersContainer from './FiltersContainer';
import '../../components/Sidebar/SidebarContentBlock.less';

const DiscoverFiltersSidebar = ({ intl, match }) => {
  // redux-store
  const dispatch = useDispatch();
  const userLocation = useSelector(getUserLocation);
  const filters = useSelector(getAvailableFilters);
  const hasMap = useSelector(getHasMap);

  if (isEmpty(userLocation)) {
    dispatch(getCoordinates());
  }

  const hasFilters = memoize(isNeedFilters);
  return hasFilters(match.params.objectType) ? (
    <div className="discover-objects-filters">
      {hasMap ? (
        <MapWrap
          wobjects={[]}
          onMarkerClick={() => {}}
          getAreaSearchData={() => {}}
          userLocation={userLocation}
        />
      ) : null}
      {!isEmpty(filters) ? (
        <div className="SidebarContentBlock">
          <div className="SidebarContentBlock__title">
            <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
            <FormattedMessage id="filters" defaultMessage="Filter" />
          </div>
          <FiltersContainer intl={intl} filters={filters} />
        </div>
      ) : null}
    </div>
  ) : null;
};

DiscoverFiltersSidebar.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default injectIntl(DiscoverFiltersSidebar);
