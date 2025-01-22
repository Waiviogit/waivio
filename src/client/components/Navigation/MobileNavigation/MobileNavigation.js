import React, { useState, useEffect } from 'react';
import { Icon, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import {
  PATH_NAME_MESSAGES,
  PATH_NAME_ACTIVE,
  PATH_NAME_DISCOVER,
  PATH_NAME_CREATE,
  PATH_NAME_MATCH_BOT,
  PATH_NAME_MANAGE,
  PATH_NAME_PAYABLES,
  PATH_NAME_BLACKLIST,
  CAMPAIGNS,
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
    case (url.match(pages.rewardsCampaigns.regExp) || {}).input:
      pageName = pages.rewardsCampaigns.id;
      filterName = url.match(pages.rewardsCampaigns.regExp)[2];
      break;
    case (url.match(pages.rewardsMatchBots.regExp) || {}).input:
      pageName = pages.rewardsCampaigns.id;
      filterName = url.match(pages.rewardsMatchBots.regExp)[2];
      break;
    case (url.match(pages.rewardsRefferal.regExp) || {}).input:
      pageName = pages.rewardsCampaigns.id;
      filterName = url.match(pages.rewardsRefferal.regExp)[2];
      break;
    case PATH_NAME_DISCOVER:
      pageName = 'users';
      filterName = 'all';
      break;
    case PATH_NAME_ACTIVE:
      pageName = 'rewards';
      filterName = 'eligible';
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
      pageName = CAMPAIGNS;
      filterName = 'payable';
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
    case '/new-accounts':
      pageName = 'tools';
      filterName = 'new_accounts';
      break;
    case '/user-affiliate-codes':
      pageName = 'tools';
      filterName = 'affiliate_codes';
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
    case '/data-import':
      pageName = 'tools';
      filterName = 'data_import';
      break;
    case '/message-bot':
      pageName = 'tools';
      filterName = 'message_bot';
      break;
    case '/reposting-bot':
      pageName = 'tools';
      filterName = 'reposting_bot';
      break;
    case '/departments-bot':
      pageName = 'tools';
      filterName = 'departments_bot';
      break;
    case '/descriptions-bot':
      pageName = 'tools';
      filterName = 'descriptions_bot';
      break;
    case '/claim-authority':
      pageName = 'tools';
      filterName = 'claim_authority';
      break;

    case '/tags-bot':
      pageName = 'tools';
      filterName = 'tags_bot';
      break;
    case '/list-duplication':
      pageName = 'tools';
      filterName = 'list_duplication';
      break;
    case '/chrome-extension':
      pageName = 'tools';
      filterName = 'chrome_extension';
      break;
    case '/create':
      pageName = 'website';
      filterName = 'create';
      break;
    case '/manage':
      pageName = 'website';
      filterName = 'manage';
      break;
    case '/payments':
      pageName = 'website';
      filterName = 'payments';
      break;
    case '/admin-websites':
      pageName = 'admin';
      filterName = 'admin_websites';
      break;
    case '/admin-whitelist':
      pageName = 'admin';
      filterName = 'admin_whitelist';
      break;
    case '/admin-new-accounts':
      pageName = 'admin';
      filterName = 'admin_new_accounts';
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
