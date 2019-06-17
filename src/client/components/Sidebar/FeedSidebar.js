import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIsAuthenticated } from '../../reducers';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import InterestingObjects from './InterestingObjects';
import CryptoTrendingCharts from './CryptoTrendingCharts';
import InterestingPeople from './InterestingPeople';

@connect(state => ({
  authenticated: getIsAuthenticated(state),
}))
class FeedSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
  };

  render() {
    const { authenticated } = this.props;
    const currentTag = _.get(this.props, 'match.params.tag', '');
    const currentCrypto = getCryptoDetails(currentTag);

    return (
      <div>
        {!_.isEmpty(currentCrypto) && <CryptoTrendingCharts cryptos={[currentTag]} />}
        {authenticated && (
          <React.Fragment>
            <InterestingObjects />
            <InterestingPeople />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default FeedSidebar;
