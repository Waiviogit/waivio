import React from 'react';
import { round } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import USDDisplay from '../../../components/Utils/USDDisplay';

import './CurrencyInfo.less';

const WAIVtokenInfo = ({ votingPower, downVotingPower, votePrice }) => (
  <div className="CurrencyInfo">
    <h4>
      <FormattedMessage id="waiv_token" defaultMessage="WAIV token" />
    </h4>
    <div>
      <i className="iconfont icon-praise text-icon" />
      <FormattedMessage id="upvoting_mana" defaultMessage="Upvoting mana" />:{' '}
      <span>{round(votingPower, 2)}%</span>
    </div>
    <div>
      <i className="iconfont icon-praise Comment__icon_dislike text-icon" />
      <FormattedMessage id="downvoting_mana" defaultMessage="Downvoting mana" />:{' '}
      <span>{round(downVotingPower, 2)}%</span>
    </div>
    <div>
      <i className="iconfont icon-dollar text-icon" />
      <FormattedMessage id="waiv_vote" defaultMessage="WAIV vote" />:{' '}
      <USDDisplay value={votePrice} />
    </div>
  </div>
);

WAIVtokenInfo.propTypes = {
  votingPower: PropTypes.number.isRequired,
  downVotingPower: PropTypes.number.isRequired,
  votePrice: PropTypes.number.isRequired,
};

export default WAIVtokenInfo;
