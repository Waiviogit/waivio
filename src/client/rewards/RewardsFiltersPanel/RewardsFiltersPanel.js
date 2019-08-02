import { Checkbox } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import './RewardsFiltersPanel.less';

const RewardsFiltersPanel = ({ sponsors, activeFilters, setFilterValue, campaignsTypes, intl }) => {
  const filterLayout = (filterName, key, checked) => (
    <div key={`${key}-${filterName}`} className="RewardsFiltersPanel__item-wrap">
      <Checkbox onChange={() => setFilterValue(filterName, key)} checked={checked} />
      <div className="RewardsFiltersPanel__name">{filterName}</div>
    </div>
  );

  return (
    <div className="RewardsFiltersPanel">
      <div className="RewardsFiltersPanel__container">
        <div className="RewardsFiltersPanel__title">
          <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
          <FormattedMessage id="filter_rewards" defaultMessage="Filter rewards" />
        </div>
        <div className="RewardsFiltersPanel__title-text">
          {`${intl.formatMessage({
            id: 'rewards_for',
            defaultMessage: `Rewards for`,
          })}:`}
        </div>
        {_.map(campaignsTypes, type =>
          filterLayout(type, 'campaignsTypes', _.includes(activeFilters.campaignsTypes, type)),
        )}
        <div className="RewardsFiltersPanel__title-text">
          {`${intl.formatMessage({
            id: 'sponsors',
            defaultMessage: `Sponsors`,
          })}:`}
        </div>
        {_.map(sponsors, sponsor =>
          filterLayout(sponsor, 'sponsors', _.includes(activeFilters.sponsors, sponsor)),
        )}
      </div>
    </div>
  );
};

RewardsFiltersPanel.propTypes = {
  sponsors: PropTypes.arrayOf(PropTypes.string).isRequired,
  campaignsTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeFilters: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  setFilterValue: PropTypes.func.isRequired,
  // intl: PropTypes.shape().isRequired,
};

RewardsFiltersPanel.defaultProps = {
  sponsors: [],
  campaignsTypes: [],
  activeFilters: {},
};

export default injectIntl(RewardsFiltersPanel);
