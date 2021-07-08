import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { ceil, get, truncate } from 'lodash';
import {
  injectIntl,
  FormattedMessage,
  FormattedTime,
  FormattedDate,
  FormattedRelative,
} from 'react-intl';
import urlParse from 'url-parse';
import { calculateVotePower } from '../../helpers/user';
import { calculateDownVote, calcReputation, dHive } from '../../vendor/steemitHelpers';
import SocialLinks from '../../components/SocialLinks';
import USDDisplay from '../../components/Utils/USDDisplay';
import { GUEST_PREFIX, BXY_GUEST_PREFIX } from '../../../common/constants/waivio';
import { getMetadata } from '../../helpers/postingMetadata';
import BTooltip from '../../components/BTooltip';
import { getTimeFromLastAction } from '../../helpers/accountHistoryHelper';
import { guestUserRegex } from '../../helpers/regexHelpers';
import { getRate, getRewardFund } from '../../../store/appStore/appSelectors';
import { getAllUsers, getUser } from '../../../store/usersStore/usersSelectors';
import { getUsersAccountHistory } from '../../../store/walletStore/walletSelectors';

@injectIntl
@connect((state, ownProps) => ({
  user: getUser(state, ownProps.match.params.name),
  rewardFund: getRewardFund(state),
  rate: getRate(state),
  allUsers: getAllUsers(state), // DO NOT DELETE! Auxiliary selector. Without it, "user" is not always updated
  usersAccountHistory: getUsersAccountHistory(state),
}))
class UserInfo extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape(),
    rewardFund: PropTypes.shape(),
    rate: PropTypes.number,
    match: PropTypes.shape().isRequired,
    usersAccountHistory: PropTypes.shape(),
  };

  static defaultProps = {
    user: {},
    rewardFund: {},
    rate: 0,
    usersAccountHistory: {},
  };

  state = {
    rc_percentage: 0,
    voting_mana: 0,
  };

  componentDidMount() {
    this.getUserInfo();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.name !== this.props.match.params.name) {
      this.getUserInfo();
    }
  }

  getUserInfo = () => {
    const { match } = this.props;

    if (
      !match.params.name.startsWith(GUEST_PREFIX) &&
      !match.params.name.startsWith(BXY_GUEST_PREFIX)
    ) {
      dHive.rc.getRCMana(match.params.name).then(res => {
        this.setState({
          rc_percentage: res.percentage,
        });
      });
      dHive.database.getAccounts([match.params.name]).then(res => {
        this.setState({
          voting_mana: dHive.rc.calculateVPMana(res[0]).percentage,
        });
      });
    }
  };

  render() {
    const { intl, user, rewardFund, rate, usersAccountHistory } = this.props;
    const isGuestPage = guestUserRegex.test(user && user.name);
    let metadata = {};
    let location = null;
    let profile = {};
    let website = null;
    let about = null;
    const lastActive = !isGuestPage ? getTimeFromLastAction(user.name, usersAccountHistory) : null;
    let email;

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
    const voteWorth =
      user && rewardFund && rate ? ceil(calculateVotePower(user, rewardFund, rate), 3) : 0;
    const rc = this.state.rc_percentage ? this.state.rc_percentage / 100 : 0;
    const votingMana = this.state.voting_mana ? this.state.voting_mana / 100 : 0;

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
                {!!calcReputation(user.reputation) && (
                  <div>
                    <i className="hashtag text-icon">#</i>
                    <FormattedMessage id="steem_reputation" defaultMessage="Hive reputation" />
                    :&nbsp;{calcReputation(user.reputation)}
                  </div>
                )}
                {user &&
                  user.name &&
                  !user.name.startsWith(GUEST_PREFIX) &&
                  !user.name.startsWith(BXY_GUEST_PREFIX) && (
                    <React.Fragment>
                      <div>
                        <i className="iconfont icon-praise text-icon" />
                        <FormattedMessage id="upvoting_mana" defaultMessage="Upvoting mana" />:{' '}
                        <span>{votingMana}%</span>
                      </div>
                      <div>
                        <i className="iconfont icon-praise Comment__icon_dislike text-icon" />
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
                            <FormattedRelative value={`${lastActive}Z`} />
                          </span>
                        </BTooltip>
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
