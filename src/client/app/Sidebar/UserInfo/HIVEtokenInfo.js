import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { round } from 'lodash';

import USDDisplay from '../../../components/Utils/USDDisplay';

import './CurrencyInfo.less';

const HIVEtokenInfo = props => (
  <div className="CurrencyInfo">
    <h4>
      {' '}
      <FormattedMessage id="hive_token" defaultMessage="HIVE token" />
    </h4>
    {!!props.reputation && (
      <div className="CurrencyInfo__line">
        <i className="hashtag text-icon">#</i>
        <FormattedMessage id="steem_reputation" defaultMessage="Hive reputation" />
        :&nbsp;{props.reputation}
      </div>
    )}
    <div className="CurrencyInfo__line">
      <i className="iconfont icon-praise text-icon" />
      <FormattedMessage id="upvoting_mana" defaultMessage="Upvoting mana" />:{' '}
      <span>{round(props.votingMana, 2)}%</span>
    </div>
    <div className="CurrencyInfo__line">
      <i className="iconfont icon-praise Comment__icon_dislike text-icon" />
      <FormattedMessage id="downvoting_mana" defaultMessage="Downvoting mana" />:{' '}
      <span>{round(props.downVotingMana, 2)}%</span>
    </div>
    <div className="CurrencyInfo__line">
      <i className="iconfont icon-flashlight text-icon" />
      <FormattedMessage id="resource_credits" defaultMessage="Resource credits" />
      <span>: {round(props.rc, 2)}%</span>
    </div>
    <div className="CurrencyInfo__line">
      <i className="iconfont icon-dollar text-icon" />
      <FormattedMessage id="hive_vote" defaultMessage="HIVE vote" />:{' '}
      <USDDisplay value={props.votePrice} />
    </div>
  </div>
);

HIVEtokenInfo.propTypes = {
  reputation: PropTypes.number,
  votingMana: PropTypes.number.isRequired,
  downVotingMana: PropTypes.number.isRequired,
  rc: PropTypes.number.isRequired,
  votePrice: PropTypes.number.isRequired,
};

export default HIVEtokenInfo;
