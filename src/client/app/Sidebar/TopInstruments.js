import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Collapse } from 'antd';
import {
  getIsTrendingTopicsLoading,
  getTrendingTopics,
} from '../../reducers';


const TopInstruments = ({ intl, trendingTopicsLoading, trendingTopics }) => {
  const instrumentGroups = [
    intl.formatMessage({id: 'modalAssets.indices', defaultMessage: 'Indicies'}),
    intl.formatMessage({id: 'wia.cryptos', defaultMessage: 'Cryptos'}),
    intl.formatMessage({id: 'wia.currencies', defaultMessage: 'Currencies'}),
    intl.formatMessage({id: 'wia.commodities', defaultMessage: 'Commodities'}),
    intl.formatMessage({id: 'modalAssets.stocks', defaultMessage: 'Stocks'}),
  ];
  return (
    <div>
      <Collapse bordered={false} defaultActiveKey={instrumentGroups}>
        {instrumentGroups.map(groupName => (
          <Collapse.Panel header={groupName} key={groupName} showArrow={false} disabled>
            <div className="top-instruments__headline">card</div>
            <div className="top-instruments__card">
              content
              content
            </div>
          </Collapse.Panel>
        ))}
      </Collapse>
  </div>)
};

TopInstruments.propTypes = {
  intl: PropTypes.shape().isRequired,
  trendingTopicsLoading: PropTypes.bool.isRequired,
  trendingTopics: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default connect(state => ({
  trendingTopicsLoading: getIsTrendingTopicsLoading(state),
  trendingTopics: getTrendingTopics(state),
}))(injectIntl(TopInstruments));
