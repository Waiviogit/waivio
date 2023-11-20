import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCryptoDetails } from '../../../common/helpers/cryptosHelper';
import InterestingObjects from './InterestingObjects';
import CryptoTrendingCharts from './CrypoCharts/CryptoTrendingCharts';
import InterestingPeople from './InterestingPeople';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';

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
