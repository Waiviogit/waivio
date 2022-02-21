import React from 'react';
import { round } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import USDDisplay from '../../../components/Utils/USDDisplay';

import './CurrencyInfo.less';

const WAIVtokenInfo = ({ votingPower, downVotingPower, votePrice, intl }) => (
  <div className="CurrencyInfo">
    <h4 tab={intl.formatMessage({ id: 'waiv_token', defaultMessage: 'WAIV token' })}>WAIV token</h4>
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
    <div tab={intl.formatMessage({ id: 'waiv_vote', defaultMessage: 'WAIV vote' })}>
      <i className="iconfont icon-dollar text-icon" />
      WAIV vote: <USDDisplay value={votePrice} />
    </div>
  </div>
);

WAIVtokenInfo.propTypes = {
  intl: PropTypes.shape().isRequired,
  votingPower: PropTypes.number.isRequired,
  downVotingPower: PropTypes.number.isRequired,
  votePrice: PropTypes.number.isRequired,
};

export default WAIVtokenInfo;
injectIntl(WAIVtokenInfo);
