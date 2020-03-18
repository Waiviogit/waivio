import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, memoize } from 'lodash';
import { isNeedFilters } from '../helper';
import {
  getAvailableFilters,
} from '../../reducers';
import FiltersContainer from './FiltersContainer';
import '../../components/Sidebar/SidebarContentBlock.less';

const DiscoverFiltersSidebar = ({ intl, match }) => {
  const filters = useSelector(getAvailableFilters);
  const isTypeHasFilters = memoize(isNeedFilters);
  return isTypeHasFilters(match.params.objectType) ? (
    <div className="discover-objects-filters">
      {!isEmpty(filters) && (
        <div className="SidebarContentBlock">
          <div className="SidebarContentBlock__title">
            <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
            <FormattedMessage id="filters" defaultMessage="Filter" />
          </div>
          <FiltersContainer intl={intl} filters={filters} />
        </div>
      )}
    </div>
  ) : null;
};

DiscoverFiltersSidebar.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default injectIntl(withRouter(DiscoverFiltersSidebar));
