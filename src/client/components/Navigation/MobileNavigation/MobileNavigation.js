import React, { useState, useEffect } from 'react';
import { Icon, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import {
  PATH_NAME_GUIDE_HISTORY,
  PATH_NAME_MESSAGES,
  PATH_NAME_ACTIVE,
  PATH_NAME_RECEIVABLES,
  PATH_NAME_DISCOVER,
  PATH_NAME_CREATE,
  PATH_NAME_MATCH_BOT,
  PATH_NAME_MANAGE,
  PATH_NAME_PAYABLES,
  PATH_NAME_BLACKLIST,
  CAMPAIGNS,
  PATH_NAME_RECEIVABLES_NEW,
  PATH_NAME_PAYABLES_NEW,
} from '../../../../common/constants/rewards';
import { pages } from './helpers';
import { getIsAuthenticated } from '../../../../store/authStore/authSelectors';

import './MobileNavigation.less';

const MobileNavigation = ({ location, match }) => {
  const [isModalOpen, setModalVisibility] = useState(false);

  useEffect(() => {
    setModalVisibility(false);
  }, [match]);
  const authenticated = useSelector(getIsAuthenticated);
  let pageName = '';
  let filterName = 'Menu';

  const { url } = match;

  switch (url) {
    case (url.match(pages.hive.regExp) || {}).input:
      pageName = pages.hive.id;
      filterName = url.match(pages.hive.regExp)[2];
      break;
    case (url.match(pages.personal.regExp) || {}).input:
      pageName = pages.personal.id;
      filterName = url.match(pages.personal.regExp)[2] || pages.personal.myFeed;
      break;
    case (url.match(pages.people.regExp) || {}).input:
      pageName = pages.people.id;
      filterName = url.match(pages.people.regExp)[2];
      break;
    case (url.match(pages.objectsUpdates.regExp) || {}).input: {
      const { search } = location;

      if (/\?category=(.+)&name=(.+)/.test(search)) {
        pageName = new URLSearchParams(search).get('category');
        filterName = new URLSearchParams(search).get('name');
      }
      break;
    }
    case (url.match(pages.discoverObjects.regExp) || {}).input:
      pageName = pages.discoverObjects.id;
      filterName = url.match(pages.discoverObjects.regExp)[2] || pages.discoverObjects.all;
      break;
    case (url.match(pages.rewards.regExp) || {}).input:
      pageName = pages.rewards.id;
      filterName = url.match(pages.rewards.regExp)[2];
      break;
    case (url.match(pages.rewardsNew.regExp) || {}).input:
      pageName = pages.rewardsNew.id;
      filterName = url.match(pages.rewardsNew.regExp)[2];
      break;
    case (url.match(pages.rewardsCampaigns.regExp) || {}).input:
      pageName = pages.rewardsCampaigns.id;
      filterName = url.match(pages.rewardsCampaigns.regExp)[2];
      break;
    case (url.match(pages.rewardsNewMatchBots.regExp) || {}).input:
      pageName = pages.rewardsNewMatchBots.id;
      filterName = url.match(pages.rewardsNewMatchBots.regExp)[2].replaceAll('-', ' ');
      break;
    case (url.match(pages.rewardsNewRefferal.regExp) || {}).input:
      pageName = pages.rewardsNewRefferal.id;
      filterName = url.match(pages.rewardsNewRefferal.regExp)[2].replaceAll('-', ' ');
      break;
    case (url.match(pages.rewardsNewCampaigns.regExp) || {}).input:
      pageName = pages.rewardsNewCampaigns.id;
      filterName = url.match(pages.rewardsNewCampaigns.regExp)[2];
      break;
    case PATH_NAME_DISCOVER:
      pageName = 'users';
      filterName = 'all';
      break;
    case PATH_NAME_ACTIVE:
      pageName = 'rewards';
      filterName = 'eligible';
      break;
    case PATH_NAME_RECEIVABLES:
    case PATH_NAME_RECEIVABLES_NEW:
      pageName = 'rewards';
      filterName = 'receivable';
      break;
    case PATH_NAME_CREATE:
      pageName = CAMPAIGNS;
      filterName = 'create';
      break;
    case PATH_NAME_MANAGE:
      pageName = CAMPAIGNS;
      filterName = 'manage';
      break;
    case PATH_NAME_PAYABLES:
    case PATH_NAME_PAYABLES_NEW:
      pageName = CAMPAIGNS;
      filterName = 'payable';
      break;
    case PATH_NAME_GUIDE_HISTORY:
      pageName = CAMPAIGNS;
      filterName = 'reservations';
      break;
    case PATH_NAME_MESSAGES:
      pageName = CAMPAIGNS;
      filterName = 'messages';
      break;
    case PATH_NAME_MATCH_BOT:
      pageName = CAMPAIGNS;
      filterName = 'match_bot';
      break;
    case PATH_NAME_BLACKLIST:
      pageName = CAMPAIGNS;
      filterName = 'blacklist';
      break;
    case '/rewards/id':
      pageName = CAMPAIGNS;
      filterName = 'match_bot';
      break;
    case '/drafts':
      pageName = 'tools';
      filterName = 'drafts';
      break;
    case '/settings':
      pageName = 'tools';
      filterName = 'settings';
      break;
    case '/bookmarks':
      pageName = 'tools';
      filterName = 'bookmarks';
      break;
    case '/edit-profile':
      pageName = 'tools';
      filterName = 'edit_profile';
      break;
    case '/invite':
      pageName = 'tools';
      filterName = 'invite';
      break;
    case '/guests-settings':
      pageName = 'tools';
      filterName = 'guest_settings';
      break;
    case '/notification-settings':
      pageName = 'tools';
      filterName = 'notification_settings';
      break;
    case '/create':
      pageName = 'website';
      filterName = 'create';
      break;
    case '/payments':
      pageName = 'website';
      filterName = 'payments';
      break;
    case '/':
      if (!authenticated) {
        pageName = pages.hive.id;
        filterName = pages.hive.trending;
      } else {
        pageName = pages.personal.id;
        filterName = pages.personal.myFeed;
      }
      break;
    default:
      break;
  }
  const page = <FormattedMessage id={`mobnav_${pageName}`} defaultMessage={pageName} />;

  return (
    <React.Fragment>
      <div className="MobileNavigation">
        <span className="MobileNavigation__title">
          {pageName && (
            <span className="MobileNavigation__topic ttc">
              {page}
              &nbsp; &gt; &nbsp;
            </span>
          )}
          <span
            className="MobileNavigation__selector"
            role="presentation"
            onClick={() => setModalVisibility(true)}
          >
            <FormattedMessage id={`mobnav_${filterName}`} defaultMessage={filterName} />
            <Icon type="caret-down" style={{ color: '#f87007' }} />
          </span>
          &nbsp;
        </span>
      </div>

      <Modal
        className="MobileNavigation__filters-modal"
        footer={null}
        title={<span style={{ textTransform: 'uppercase' }}>{page}</span>}
        closable
        visible={isModalOpen}
        onCancel={() => setModalVisibility(false)}
      >
        <LeftSidebar />
      </Modal>
    </React.Fragment>
  );
};

MobileNavigation.propTypes = {
  location: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default withRouter(MobileNavigation);
