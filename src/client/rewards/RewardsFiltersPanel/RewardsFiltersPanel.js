// import { Checkbox } from 'antd';
// import _ from 'lodash';
// import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import './RewardsFiltersPanel.less';

// const RewardsFiltersPanel = ({ campaignsTypes, sponsors, activeFilters, setFilterValue }) => {
const RewardsFiltersPanel = () => (
  // const filterLayout = (filterName, key, checked) => (
  //   <div key={`${key}-${filterName}`} className="ObjectTypeFiltersPanel__item-wrap">
  //     <Checkbox onChange={() => setFilterValue(filterName, key)} checked={checked} />
  //     <div className="ObjectTypeFiltersPanel__name">{filterName}</div>
  //   </div>
  // );

  <div className="ObjectTypeFiltersPanel">
    <div className="ObjectTypeFiltersPanel__container">
      <div className="ObjectTypeFiltersPanel__title">
        <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
        <FormattedMessage id="filter_rewards" defaultMessage="Filter rewards" />
      </div>
    </div>
  </div>
);

RewardsFiltersPanel.propTypes = {
  // filters: PropTypes.shape(),
  // activefilters: PropTypes.shape(),
  // setFilterValue: PropTypes.func.isRequired,
  // intl: PropTypes.shape().isRequired,
};

RewardsFiltersPanel.defaultProps = {
  filters: {},
  activefilters: { map: true },
};

export default injectIntl(RewardsFiltersPanel);
