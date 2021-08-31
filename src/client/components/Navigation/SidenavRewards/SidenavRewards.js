import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ModalSignIn from '../ModlaSignIn/ModalSignIn';
import SectionTitle from './SectionTitle';
import SectionOneItem from './SectionOneItem';
import SectionItems from './SectionItems';
import {
  getSectionItemsCampaigns,
  getSectionItemsMatchBots,
  getSectionItemsReferrals,
  getSectionItemsRewards,
} from '../../../helpers/sidenavRewardsHelpers';

import '../Sidenav.less';

const SidenavRewards = ({
  intl,
  authenticated,
  isGuest,
  hasReceivables,
  countTookPartCampaigns,
  createdCampaignsCount,
  authUserName,
  isWaivio,
  isExpired,
}) => {
  const [menuCondition, setMenuCondition] = React.useState({
    rewards: true,
    campaigns: true,
    referrals: true,
    matchBots: true,
  });

  const toggleMenuCondition = menuItem => {
    setMenuCondition(prev => ({ ...prev, [menuItem]: !prev[menuItem] }));
  };

  return (
    <React.Fragment>
      <ul className="Sidenav">
        <SectionTitle
          sectionId="rewards"
          defaultName="Rewards"
          nameKey="sidenav_rewards"
          isOpen={menuCondition.rewards}
          toggleSection={toggleMenuCondition}
        />
        {menuCondition.rewards && (
          <SectionOneItem path={'/rewards/all'} sectionItemNameId="all" sectionItemName="All" />
        )}
        {authenticated ? (
          <React.Fragment>
            {menuCondition.rewards && (
              <React.Fragment>
                <SectionItems
                  sections={getSectionItemsRewards(hasReceivables, countTookPartCampaigns)}
                />
              </React.Fragment>
            )}
            {isWaivio && (
              <React.Fragment>
                <SectionTitle
                  sectionId="campaigns"
                  defaultName="Campaigns"
                  nameKey="campaigns"
                  isOpen={menuCondition.campaigns}
                  toggleSection={toggleMenuCondition}
                />
                <SectionOneItem
                  isShow={isGuest && menuCondition.campaigns}
                  path={`/rewards/reports`}
                  sectionItemNameId="sidenav_rewards_reports"
                  sectionItemName="Reports"
                />
                {!isGuest && menuCondition.campaigns && (
                  <React.Fragment>
                    <SectionOneItem
                      path={`/rewards/create`}
                      sectionItemNameId="create"
                      sectionItemName="Create"
                    />
                    {!!createdCampaignsCount && (
                      <React.Fragment>
                        <SectionOneItem
                          path={`/rewards/manage`}
                          sectionItemNameId="manage"
                          sectionItemName="Manage"
                        />
                        <SectionOneItem
                          isExpired={isExpired}
                          sectionItemName="Payables"
                          path={`/rewards/payables`}
                          sectionItemNameId="sidenav_rewards_payables"
                        />
                      </React.Fragment>
                    )}
                    <SectionItems sections={getSectionItemsCampaigns(authUserName)} />
                  </React.Fragment>
                )}
                {!isGuest && (
                  <React.Fragment>
                    <SectionTitle
                      sectionId="referrals"
                      defaultName="Referrals"
                      nameKey="referrals"
                      isOpen={menuCondition.referrals}
                      toggleSection={toggleMenuCondition}
                    />
                    {menuCondition.referrals && (
                      <SectionItems sections={getSectionItemsReferrals(authUserName)} />
                    )}
                    <SectionTitle
                      sectionId="matchBots"
                      defaultName="Match bots"
                      nameKey="matchBots"
                      isOpen={menuCondition.matchBots}
                      toggleSection={toggleMenuCondition}
                    />
                    {menuCondition.matchBots && (
                      <SectionItems sections={getSectionItemsMatchBots(authUserName)} />
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <span className="tc">
            {intl.formatMessage({
              id: 'pleaseLogin',
              defaultMessage: `For more options please`,
            })}{' '}
            <ModalSignIn isButton={false} />
          </span>
        )}
      </ul>
    </React.Fragment>
  );
};

SidenavRewards.propTypes = {
  intl: PropTypes.shape().isRequired,
  authenticated: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  hasReceivables: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  isWaivio: PropTypes.bool,
  isExpired: PropTypes.bool,
  countTookPartCampaigns: PropTypes.number,
  createdCampaignsCount: PropTypes.number,
  authUserName: PropTypes.string,
};

SidenavRewards.defaultProps = {
  autoCompleteSearchResults: {},
  hasReceivables: false,
  isExpired: false,
  isWaivio: true,
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  authUserName: '',
};

export default injectIntl(SidenavRewards);
