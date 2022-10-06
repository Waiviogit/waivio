import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Checkbox, Modal } from 'antd';
import { useHistory } from 'react-router';
import { isEmpty, noop } from 'lodash';
import PropTypes from 'prop-types';

import './Filters.less';

const RewardsFilters = ({ config, getFilters, onlyOne, visible, onClose, intl }) => {
  const [activeFilters, setActiveFilters] = useState({});
  const history = useHistory();
  const query = new URLSearchParams(history.location.search);
  const [filters, setFilter] = useState({});
  const setFiltersFromQuery = () => {
    const types = config.map(conf => conf.type);

    setActiveFilters(
      types.reduce((acc, curr) => {
        const filtrs = query.get(curr);

        if (filtrs) {
          acc[curr] = filtrs?.split(',');
        }

        return acc;
      }, {}),
    );
  };

  useEffect(() => {
    getFilters().then(res => {
      setFilter(res);
    });
    setFiltersFromQuery();
  }, []);

  useEffect(() => {
    setFiltersFromQuery();
  }, [history.location.search]);

  const setFilters = (type, filter, filterOnlyOne = false) => {
    const filreList = activeFilters[type] || [];

    if (filreList.includes(filter)) {
      const filteredList = filreList.filter(name => name !== filter);

      if (isEmpty(filteredList)) {
        query.delete(type);
      } else {
        query.set(type, filteredList.join(','));
      }

      setActiveFilters({
        ...activeFilters,
        [type]: filteredList,
      });
    } else {
      const newListFilters = onlyOne || filterOnlyOne ? [filter] : [...filreList, filter];

      query.set(type, newListFilters.join(','));
      setActiveFilters({
        ...activeFilters,
        [type]: newListFilters,
      });
    }

    history.push(`?${query.toString()}`);
  };

  if (Object.values(filters).every(fltrArray => isEmpty(fltrArray))) return null;

  const body = (
    <div className="RewardsFilters">
      <div className="RewardsFilters__title">
        <i className="iconfont icon-trysearchlist RewardsFilters__icon" />
        <FormattedMessage id="filter_rewards" defaultMessage="Filter rewards" />
      </div>
      {config.map(filter => {
        if (isEmpty(filters?.[filter?.type])) return null;

        return (
          <div className="RewardsFilters__block" key={filter.title}>
            {filter.title && <span className="RewardsFilters__subtitle">{filter.title}:</span>}
            {filters?.[filter?.type]?.map(check => {
              const value = typeof check === 'object' ? check.value : check;
              const title = typeof check === 'object' ? check.title : check;

              return (
                <div key={value}>
                  <Checkbox
                    checked={activeFilters[filter.type]?.includes(value)}
                    onChange={() => setFilters(filter.type, value, filter.onlyOne)}
                  >
                    {' '}
                    {intl.formatMessage({ id: `filter_${title}`, defaultMessage: title })}
                  </Checkbox>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  return visible ? (
    <Modal visible={visible} onCancel={onClose} onOk={onClose}>
      {body}
    </Modal>
  ) : (
    body
  );
};

RewardsFilters.propTypes = {
  getFilters: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  onlyOne: PropTypes.bool,
  visible: PropTypes.bool,
  config: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

RewardsFilters.defaultProps = {
  onlyOne: false,
  visible: false,
  onClose: noop,
};

export default injectIntl(RewardsFilters);
