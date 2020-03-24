import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { get } from 'lodash';
import urlParse from 'url-parse';
import { getUser, getRewardFund, getRate } from '../../reducers';
import { getVoteValue } from '../../helpers/user';
import {
  calculateDownVote,
  calculateVotingPower,
  calcReputation,
  dSteem,
} from '../../vendor/steemitHelpers';
import SocialLinks from '../../components/SocialLinks';
import USDDisplay from '../../components/Utils/USDDisplay';
import { GUEST_PREFIX } from '../../../common/constants/waivio';

@injectIntl
@connect((state, ownProps) => ({
  user: getUser(state, ownProps.match.params.name),
  rewardFund: getRewardFund(state),
  rate: getRate(state),
}))
class UserInfo extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
  };
  state = {
    rc_percentage: 0,
  };

  render() {
    const { intl, user, rewardFund, rate } = this.props;
    let metadata = {};
    let location = null;
    let profile = {};
    let website = null;
    let about = null;
    let lastActive;

    if (user && user.json_metadata && user.json_metadata !== '') {
      lastActive = intl.formatRelative(Date.parse(user.updatedAt));

      if (user.json_metadata.profile) {
        location = user.json_metadata.profile.location;
        profile = user.json_metadata.profile || {};
        website = user.json_metadata.profile.website;
        about = user.json_metadata.profile.about;
      } else {
        try {
          metadata = JSON.parse(user.json_metadata);
          location = metadata && get(metadata, 'profile.location');
          profile = (metadata && get(metadata, 'profile')) || {};
          website = metadata && get(metadata, 'profile.website');
          about = metadata && get(metadata, 'profile.about');
        } catch (e) {
          // do nothing
        }
      }
    }

    if (user.name && !this.state.rc_percentage) {
      dSteem.rc.getRCMana(user.name).then(res => {
        this.setState({
          rc_percentage: res.percentage,
        });
      });
    }

    if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
      website = `http://${website}`;
    }
    const url = urlParse(website);
    let hostWithoutWWW = url.host;

    if (hostWithoutWWW.indexOf('www.') === 0) {
      hostWithoutWWW = hostWithoutWWW.slice(4);
    }

    const voteWorth =
      user && rewardFund.recent_claims && rewardFund.reward_balance && rate
        ? getVoteValue(user, rewardFund.recent_claims, rewardFund.reward_balance, rate, 10000)
        : 0;
    const rc = this.state.rc_percentage / 100;

    return (
      <div className="UserInfo">
        {user.name && (
          <div style={{ wordBreak: 'break-word' }}>
            {about && <div style={{ fontSize: '18px' }}>{about}</div>}
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              {location && (
                <div>
                  <i className="iconfont icon-coordinates text-icon" />
                  {location}
                </div>
              )}
              {website && (
                <div>
                  <i className="iconfont icon-link text-icon" />
                  <a target="_blank" rel="noopener noreferrer" href={website}>
                    {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}
                  </a>
                </div>
              )}
              <div className="UserInfo__list">
                <div>
                  <Icon type="calendar" className="text-icon" />
                  <FormattedMessage
                    id="joined_date"
                    defaultMessage="Joined: {date}"
                    values={{
                      date: intl.formatDate(user.created || user.createdAt, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }),
                    }}
                  />
                </div>
                <div>
                  <i className="hashtag text-icon">#</i>
                  <FormattedMessage id="steem_reputation" defaultMessage="Hive reputation" />:{' '}
                  {calcReputation(user.reputation)}
                </div>
                {!user.name.startsWith(GUEST_PREFIX) && (
                  <React.Fragment>
                    <div>
                      <Icon type="like-o" className="text-icon" />
                      <FormattedMessage id="upvoting_mana" defaultMessage="Upvoting mana" />:{' '}
                      <FormattedNumber
                        style="percent" // eslint-disable-line react/style-prop-object
                        value={calculateVotingPower(user)}
                        maximumFractionDigits={0}
                      />
                    </div>
                    <div>
                      <Icon type="dislike-o" className="text-icon" />
                      <FormattedMessage
                        id="downvoting_mana"
                        defaultMessage="Downvoting mana"
                      />: <span>{calculateDownVote(user)}%</span>
                    </div>
                    <div>
                      <i className="iconfont icon-flashlight text-icon" />
                      <FormattedMessage id="resource_credits" defaultMessage="Resource credits" />
                      <span>: {rc}%</span>
                    </div>
                    <div>
                      <i className="iconfont icon-time text-icon" />
                      <FormattedMessage id="active_info" defaultMessage="Active" />: {lastActive}
                    </div>
                    <div>
                      <i className="iconfont icon-dollar text-icon" />
                      <FormattedMessage id="vote_price" defaultMessage="Vote Value" />:{' '}
                      {isNaN(voteWorth) ? (
                        <Icon type="loading" className="text-icon-right" />
                      ) : (
                        <USDDisplay value={voteWorth} />
                      )}
                    </div>
                  </React.Fragment>
                )}

                <SocialLinks profile={profile} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserInfo;
