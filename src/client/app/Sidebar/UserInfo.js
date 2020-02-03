import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import { get } from 'lodash';
import urlParse from 'url-parse';
import { getRate, getRewardFund, getScreenSize, getUser } from '../../reducers';
import { getVoteValue } from '../../helpers/user';
import { calculateVotingPower } from '../../vendor/steemitHelpers';
import SocialLinks from '../../components/SocialLinks';
import USDDisplay from '../../components/Utils/USDDisplay';
import ModalComparePerformance from '../../../investarena/components/Modals/ModalComparePerformance/ModalComparePerformance';
import LongTermStatistics from '../../../investarena/components/LeftSidebar/LongTermStatistics/LongTermStatistics';
import api from '../../../investarena/configApi/apiResources';
import { GUEST_PREFIX } from '../../../common/constants/waivio';

@injectIntl
@connect((state, ownProps) => ({
  user: getUser(state, ownProps.match.params.name),
  rewardFund: getRewardFund(state),
  rate: getRate(state),
  screenSize: getScreenSize(state),
}))
class UserInfo extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
    screenSize: PropTypes.string.isRequired,
  };
  static defaultProps = {
    screenSize: 'medium',
  };

  state = {
    isModalComparePerformanceOpen: false,
  };

  toggleModalPerformance = () =>
    this.setState(prevState => ({
      isModalComparePerformanceOpen: !prevState.isModalComparePerformanceOpen,
    }));

  render() {
    const { intl, user, rewardFund, rate } = this.props;
    let metadata = {};
    let location = null;
    let profile = {};
    let website = null;
    let about = null;
    if (user && user.json_metadata && user.json_metadata !== '') {
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

    const isMobile = this.props.screenSize === 'xsmall';
    return (
      <div>
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
              <div>
                <i className="iconfont icon-time text-icon" />
                <FormattedMessage
                  id="joined_date"
                  defaultMessage="Joined {date}"
                  values={{
                    date: intl.formatDate(user.created || user.createdAt, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }),
                  }}
                />
              </div>
              {!user.name.startsWith(GUEST_PREFIX) && (
                <React.Fragment>
                  <div>
                    <i className="iconfont icon-flashlight text-icon" />
                    <FormattedMessage id="voting_power" defaultMessage="Voting Power" />:{' '}
                    <FormattedNumber
                      style="percent" // eslint-disable-line react/style-prop-object
                      value={calculateVotingPower(user)}
                      maximumFractionDigits={0}
                    />
                  </div>
                  <div>
                    <i className="iconfont icon-dollar text-icon" />
                    <FormattedMessage id="vote_value" defaultMessage="Vote Value" />:{' '}
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
        )}
        {this.props.user.name && (
          <LongTermStatistics
            itemId={this.props.user.name}
            fetcher={api.performers.getUserStatistics}
            withCompareButton
            toggleModalPerformance={this.toggleModalPerformance}
            isMobile={isMobile}
          >
            <div>
              {intl.formatMessage({
                id: 'unavailableStatisticsUser',
                defaultMessage: 'The user has not written any posts with forecasts',
              })}
            </div>
          </LongTermStatistics>
        )}
        {this.state.isModalComparePerformanceOpen && this.props.user.name && !isMobile && (
          <ModalComparePerformance
            toggleModal={this.toggleModalPerformance}
            isModalOpen={this.state.isModalComparePerformanceOpen}
            item={this.props.user.name}
            isItemUser
          />
        )}
      </div>
    );
  }
}

export default UserInfo;
