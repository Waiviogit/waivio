import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'antd';
import './DailyChange.less';

const DailyChange = quote => <>
  <span className={`DailyChange__quote ${quote.dailyChange >= 0 ? 'long' : 'short'}`}>
            {`${quote.dailyChange.toFixed(2)}%`}
  </span>,
  <span className="DailyChange__arrow">
    {quote.dailyChange >= 0 ? (
        <Icon type="arrow-up" className="long" />
      ) : (
        <Icon type="arrow-down" className="short" />
      )}
</span>
</>;

DailyChange.propTypes = {
  quote: PropTypes.shape().isRequired
};

export default React.memo(DailyChange);
