import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import './Manage.less';
import * as ApiClient from '../../../waivioApi/ApiClient';
import CampaingRewardsTable from './CampaingRewardsTable/CampaingRewardsTable';
import BalanceTable from './BalanceTable/BalanceTable';

@injectIntl
class Manage extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    intl: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    userName: '',
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
    const oneStarSign = '* ';
    const twoStarSigns = '** ';
    return (
      <React.Fragment>
        <div>
          {intl.formatMessage({
            id: 'campaigns_be_suspended',
            defaultMessage: `All campaigns will be suspended if:`,
          })}
        </div>
        <div>
          {oneStarSign +
            intl.formatMessage({
              id: 'accounts_payable_exeed',
              defaultMessage: `accounts payable exeed 30 days`,
            })}
        </div>
        <div>
          {twoStarSigns +
            intl.formatMessage({
              id: 'remaining_balance_is_not_sufficient',
              defaultMessage: `the remaining balance i snot sufficient to cover outstanding obligations`,
            })}
        </div>
      </React.Fragment>
    );
  };

  rewardsCampaignContent = () => {
    const { intl } = this.props;
    const threeStarSigns = '*** ';
    const fourStarSigns = '**** ';
    return (
      <React.Fragment>
        <div>
          {threeStarSigns +
            intl.formatMessage({
              id: 'only_inactive_campaogns',
              defaultMessage: `Only inactive campaogns can be edited`,
            })}
        </div>
        <div>
          {fourStarSigns +
            intl.formatMessage({
              id: 'campaign_budgets_calcualted',
              defaultMessage: `Campaign budgets calcualted from the 1st day of each month`,
            })}
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { intl } = this.props;
    const { budgetTotal, campaigns } = this.state;
    const balanceContent = this.balanceContent();
    const rewardsCampaignContent = this.rewardsCampaignContent();
    return (
      <div className="Manage">
        <div className="Manage__account-balance-wrap">
          <div className="Manage__account-balance-wrap-title">
            {intl.formatMessage({
              id: 'rewardAccountBalance',
              defaultMessage: `Account balance (SBD)`,
            })}
          </div>
          <BalanceTable intl={intl} budgetTotal={budgetTotal} />
          <div className="Manage__account-balance-wrap-text-content">{balanceContent}</div>
          <div className="Manage__rewards-campaign-wrap">
            <div className="Manage__rewards-campaign-wrap-title">
              {intl.formatMessage({
                id: 'manageRewardsCampaign',
                defaultMessage: `Manage rewards campaign`,
              })}
            </div>
            <CampaingRewardsTable intl={intl} campaigns={campaigns} />
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
      </div>
    );
  }
}

export default Manage;
