import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { get, truncate } from 'lodash';
import {
  injectIntl,
  FormattedMessage,
  FormattedTime,
  FormattedDate,
  FormattedRelative,
} from 'react-intl';
import urlParse from 'url-parse';
import { calculateDownVote, calcReputation } from '../../../vendor/steemitHelpers';
import SocialLinks from '../../../components/SocialLinks';
import USDDisplay from '../../../components/Utils/USDDisplay';
import { getMetadata } from '../../../../common/helpers/postingMetadata';
import BTooltip from '../../../components/BTooltip';
import { getTimeFromLastAction } from '../../../../common/helpers/accountHistoryHelper';
import { guestUserRegex } from '../../../../common/helpers/regexHelpers';
import { getRate, getRewardFund, getWeightValue } from '../../../../store/appStore/appSelectors';
import { getUser } from '../../../../store/usersStore/usersSelectors';
import { getUsersAccountHistory } from '../../../../store/walletStore/walletSelectors';
import WeightDisplay from '../../../components/Utils/WeightDisplay';
import WAIVtokenInfo from './WAIVtokenInfo';
import HIVEtokenInfo from './HIVEtokenInfo';

@injectIntl
@connect((state, ownProps) => {
  const user = getUser(state, ownProps.match.params.name);

  return {
    user,
    rewardFund: getRewardFund(state),
    rate: getRate(state),
    usersAccountHistory: getUsersAccountHistory(state),
    weightValue: getWeightValue(state, user.wobjects_weight),
  };
})
class UserInfo extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape(),
    weightValue: PropTypes.number,
    usersAccountHistory: PropTypes.shape(),
  };

  static defaultProps = {
    user: {},
    rewardFund: {},
    rate: 0,
    weightValue: 0,
    usersAccountHistory: {},
  };

  render() {
    const { intl, user, usersAccountHistory } = this.props;
    const isGuestPage = guestUserRegex.test(user && user.name);
    let metadata = {};
    let location = null;
    let profile = {};
    let website = null;
    let about = null;
    let email;
    const lastActive = !isGuestPage ? getTimeFromLastAction(user.name, usersAccountHistory) : null;

    if (user && user.posting_json_metadata && user.posting_json_metadata !== '') {
      metadata = getMetadata(user);
      profile = get(metadata, 'profile', {});
      location = metadata && get(profile, 'location');
      website = metadata && get(profile, 'website');
      about = metadata && get(profile, 'about');
      email = metadata && get(profile, 'email');
    }

    if (website && website.indexOf('http://') === -1 && website.indexOf('https://') === -1) {
      website = `http://${website}`;
    }
    const url = urlParse(website);
    let hostWithoutWWW = url.host;

    if (hostWithoutWWW.indexOf('www.') === 0) {
      hostWithoutWWW = hostWithoutWWW.slice(4);
    }

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
                  <i className="iconfont icon-link text-icon link" />
                  <a target="_blank" rel="noopener noreferrer" href={website}>
                    {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}
                  </a>
                </div>
              )}
              {email && (
                <div>
                  <Icon type="mail" className="text-icon medium" />
                  <a target="_blank" rel="noopener noreferrer" href={`mailto:${email}`}>
                    {truncate(email, {
                      length: 21,
                      omission: '...',
                    })}
                  </a>
                </div>
              )}
              <div className="UserInfo__list">
                <div>
                  <Icon type="calendar" className="text-icon medium" />
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
                  <FormattedMessage id="expertise" defaultMessage="Expertise" />
                  :&nbsp;
                  <WeightDisplay value={this.props.weightValue} />
                </div>
                {!isGuestPage && (
                  <React.Fragment>
                    <div>
                      <i className="iconfont icon-time text-icon" />
                      <FormattedMessage id="active_info" defaultMessage="Active" />: &nbsp;
                      <BTooltip
                        title={
                          <span>
                            <FormattedDate value={`${lastActive}Z`} />{' '}
                            <FormattedTime value={`${lastActive}Z`} />
                          </span>
                        }
                      >
                        <span>
                          <FormattedRelative value={lastActive} />
                        </span>
                      </BTooltip>
                    </div>
                    <div>
                      <i className="iconfont icon-dollar text-icon" />
                      <FormattedMessage id="vote_price" defaultMessage="Vote value" />:{' '}
                      <USDDisplay value={user.totalVotingPowerPrice} />
                    </div>
                  </React.Fragment>
                )}
                <SocialLinks profile={profile} />
              </div>
              {!isGuestPage && (
                <React.Fragment>
                  <WAIVtokenInfo
                    votingPower={user.waivVotingPower}
                    downVotingPower={user.waivDownvotingPower}
                    votePrice={user.waivVotingPowerPrice}
                  />
                  <HIVEtokenInfo
                    downVotingMana={calculateDownVote(user)}
                    rc={user.rc_percentage}
                    reputation={calcReputation(user.reputation)}
                    votingMana={user.voting_mana}
                    votePrice={user.hiveVotingPowerPrice}
                  />
                </React.Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default UserInfo;
