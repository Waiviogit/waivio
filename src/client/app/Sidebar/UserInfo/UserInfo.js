import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { get, truncate } from 'lodash';
import { FormattedDate, FormattedMessage, FormattedTime, injectIntl } from 'react-intl';
import urlParse from 'url-parse';
import { calcReputation, calculateDownVote } from '../../../vendor/steemitHelpers';
import SocialLinks from '../../../components/SocialLinks';
import USDDisplay from '../../../components/Utils/USDDisplay';
import { getMetadata } from '../../../../common/helpers/postingMetadata';
import BTooltip from '../../../components/BTooltip';
import { guestUserRegex } from '../../../../common/helpers/regexHelpers';
import { getRate, getRewardFund } from '../../../../store/appStore/appSelectors';
import { getSideBarLoading, getUser } from '../../../../store/usersStore/usersSelectors';
import WeightDisplay from '../../../components/Utils/WeightDisplay';
import WAIVtokenInfo from './WAIVtokenInfo';
import HIVEtokenInfo from './HIVEtokenInfo';
import SkeletonRow from '../../../components/Skeleton/SkeletonRow';
import { setLinkSafetyInfo } from '../../../../store/wObjectStore/wobjActions';

@injectIntl
@connect(
  (state, ownProps) => {
    const user = getUser(state, ownProps.match.params.name);

    return {
      user,
      rewardFund: getRewardFund(state),
      rate: getRate(state),
      weightValue: user.wobjects_weight,
      sideBarLoading: getSideBarLoading(state, ownProps.match.params.name),
    };
  },
  {
    setLinkSafetyInfo,
  },
)
class UserInfo extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    user: PropTypes.shape(),
    weightValue: PropTypes.number,
    sideBarLoading: PropTypes.bool,
    setLinkSafetyInfo: PropTypes.func,
  };

  static defaultProps = {
    user: {},
    rewardFund: {},
    rate: 0,
    weightValue: 0,
    usersAccountHistory: {},
    sideBarLoading: false,
  };

  render() {
    const { intl, user, sideBarLoading, match } = this.props;

    if (sideBarLoading) return <SkeletonRow rows={8} />;

    const isGuestPage = guestUserRegex.test(user?.name);
    let metadata = {};
    let location = null;
    let profile = {};
    let website = null;
    let about = null;
    let email;

    const lastActive = !isGuestPage ? user.last_activity : null;

    if (user && user.posting_json_metadata && user.posting_json_metadata !== '') {
      metadata = getMetadata(user);
      profile = get(metadata, 'profile', {});
      location = metadata && get(profile, 'location');
      website = metadata && get(profile, 'website');
      about = metadata && get(profile, 'about');
      email = metadata && get(profile, 'email');
    }

    const relativeString = intl.formatRelative(lastActive);
    const lastActivity = relativeString?.includes('in')
      ? `${relativeString?.replace('in', '').trim()} ago`
      : relativeString;

    if (website && website?.indexOf('http://') === -1 && website?.indexOf('https://') === -1) {
      website = `http://${website}`;
    }
    const url = urlParse(website);
    let hostWithoutWWW = url.host;

    if (hostWithoutWWW?.indexOf('www.') === 0) {
      hostWithoutWWW = hostWithoutWWW.slice(4);
    }
    const description = `Discover the dynamic profile of ${match.params.name}, a valued member of our community. Dive into their expertise, activity, and engagement, and explore their involvement with various tokens. Uncover insights into their contributions and participation within our platform. Get to know ${match.params.name} better today!`;

    return (
      <div className="UserInfo">
        <Helmet>
          <meta name="description" content={description} />
          <meta name="twitter:description" content={description} />
          <meta property="og:type" content="article" />
          <meta property="og:description" content={description} />
        </Helmet>
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
                  <span
                    className={'main-color-button'}
                    onClick={() => this.props.setLinkSafetyInfo(website)}
                  >
                    {`${hostWithoutWWW}${url.pathname.replace(/\/$/, '')}`}
                  </span>
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
                {!isGuestPage && lastActive && (
                  <React.Fragment>
                    <div>
                      <i className="iconfont icon-time text-icon" />
                      <FormattedMessage id="active_info" defaultMessage="Active" />: &nbsp;
                      <BTooltip
                        title={
                          <span>
                            <FormattedDate value={lastActive} />{' '}
                            <FormattedTime value={lastActive} />
                          </span>
                        }
                      >
                        <span>{lastActivity}</span>
                      </BTooltip>
                    </div>
                    <div>
                      <i className="iconfont icon-dollar text-icon" />
                      <FormattedMessage id="vote_price" defaultMessage="Vote value" />:{' '}
                      <USDDisplay value={user.totalVotingPowerPrice} />
                    </div>
                  </React.Fragment>
                )}
                {isGuestPage && (
                  <React.Fragment>
                    <i className="iconfont icon-flashlight text-icon" />
                    Guest mana: {user.guestMana}%
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
UserInfo.fetchData = async ({ store, match }) => {
  const state = store.getState();
  const user = getUser(state, match.params.name);

  return getMetadata(user);
};

export default UserInfo;
