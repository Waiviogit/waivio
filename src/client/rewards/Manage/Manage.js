import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import * as ApiClient from '../../../waivioApi/ApiClient';
import CampaignRewardsTable from './CampaignRewardsTable/CampaignRewardsTable';
import BalanceTable from './BalanceTable/BalanceTable';
import { activateCampaign, inactivateCampaign } from '../../user/userActions';
import { getAuthenticatedUser, getAuthGuestBalance, isGuestUser } from '../../reducers';
import Error401 from '../../statics/Error401';
import './Manage.less';

@injectIntl
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    isGuest: isGuestUser(state),
    guestBalance: getAuthGuestBalance(state),
  }),
  { activateCampaign, inactivateCampaign },
)
class Manage extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    intl: PropTypes.shape().isRequired,
    user: PropTypes.shape(),
    activateCampaign: PropTypes.func,
    inactivateCampaign: PropTypes.func,
    isGuest: PropTypes.bool,
    guestBalance: PropTypes.number,
  };
  static defaultProps = {
    userName: '',
    user: {},
    activateCampaign: () => {},
    inactivateCampaign: () => {},
    isGuest: false,
    guestBalance: null,
  };
  state = {
    campaigns: [],
    budgetTotal: {},
  };

  componentDidMount() {
    const { userName } = this.props;
    if (userName) {
      ApiClient.getCampaignsByGuideName(userName).then(data => {
        this.setState({
          budgetTotal: data.dashboard.budget_total,
          campaigns: data.dashboard.campaigns,
        });
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { userName } = this.props;
    if (userName !== prevProps.userName) {
      ApiClient.getCampaignsByGuideName(userName).then(data => {
        this.setState({
          budgetTotal: data.dashboard.budget_total,
          campaigns: data.dashboard.campaigns,
        });
      });
    }
  }

  balanceContent = () => {
    const { intl } = this.props;
    return (
      <React.Fragment>
        <div>
          *{' '}
          {intl.formatMessage({
            id: 'campaigns_be_suspended',
            defaultMessage: `All campaigns will be suspended if`,
          })}
        </div>
      </React.Fragment>
    );
  };

  rewardsCampaignContent = () => {
    const { intl } = this.props;
    return (
      <React.Fragment>
        <div>
          **{' '}
          {intl.formatMessage({
            id: 'only_inactive_campaigns',
            defaultMessage: `Only inactive campaigns can be edited`,
          })}
        </div>
      </React.Fragment>
    );
  };

  render() {
    const {
      intl,
      // eslint-disable-next-line no-shadow
      activateCampaign,
      // eslint-disable-next-line no-shadow
      inactivateCampaign,
      user,
      userName,
      isGuest,
      guestBalance,
    } = this.props;
    const { budgetTotal, campaigns } = this.state;
    const balanceContent = this.balanceContent();
    const rewardsCampaignContent = this.rewardsCampaignContent();
    return (
      <div className="Manage">
        {userName ? (
          <React.Fragment>
            <div className="Manage__account-balance-wrap">
              <div className="Manage__account-balance-wrap-title">
                {intl.formatMessage({
                  id: 'manage_page_account_balance',
                  defaultMessage: `Account balance (HIVE)`,
                })}
              </div>
              <BalanceTable
                isGuest={isGuest}
                guestBalance={guestBalance}
                intl={intl}
                budgetTotal={budgetTotal}
                user={user}
              />
              <div className="Manage__account-balance-wrap-text-content">{balanceContent}</div>
              <div className="Manage__rewards-campaign-wrap">
                <div className="Manage__rewards-campaign-wrap-title">
                  {intl.formatMessage({
                    id: 'manage_page_manage_campaign',
                    defaultMessage: `Manage rewards campaign`,
                  })}
                </div>
                <CampaignRewardsTable
                  activateCampaign={activateCampaign}
                  inactivateCampaign={inactivateCampaign}
                  campaigns={campaigns}
                  userName={user.name}
                />
                <div className="Manage__rewards-campaign-wrap-text-content">
                  {rewardsCampaignContent}
                </div>
              </div>
            </div>
            <button className="Manage__button">
              <Link to={`/rewards/create`}>
                {intl.formatMessage({
                  id: 'createNewCampaign',
                  defaultMessage: `Create new campaign`,
                })}{' '}
              </Link>
            </button>
          </React.Fragment>
        ) : (
          <Error401 />
        )}
      </div>
    );
  }
}

export default Manage;
