import React, { useState, useEffect } from 'react';
import { Icon, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { getIsAuthenticated } from '../../../reducers';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import './MobileNavigation.less';

const MobileNavigation = ({ location, match }) => {
  const [isModalOpen, setModalVisibility] = useState(false);
  useEffect(() => {
    setModalVisibility(false);
  }, [match]);
  const authenticated = useSelector(getIsAuthenticated);

  const pages = {
    hive: {
      trending: 'trending',
      regExp: /(^\/)(created|hot|trending)$/,
      id: 'hive',
    },
    personal: {
      myFeed: 'my_feed',
      regExp: /(^\/)(notifications-list|updates)$/,
      id: 'personal',
    },
    people: {
      regExp: /(^\/blog)\/(@[\w\d.-]{3,})$/,
      id: 'people',
    },
    objectsUpdates: {
      regExp: /(^\/feed\/)([\w\d.-]{3,})/,
    },
    discoverObjects: {
      all: 'all',
      regExp: /(^\/discover-objects)\/?(.*)/,
      id: 'objects',
    },
    rewards: {
      regExp: /(^\/rewards\/)(all|active|reserved|receivables|history)/,
      id: 'rewards',
    },
    rewardsCampaigns: {
      regExp: /(^\/rewards\/)(create|manage|payables|match-bot)$/,
      id: 'campaigns',
    },
  };

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
    case '/discover':
      pageName = 'users';
      filterName = 'all';
      break;
    case '/rewards/active':
      pageName = 'rewards';
      filterName = 'eligible';
      break;
    case '/rewards/receivables':
      pageName = 'rewards';
      filterName = 'receivables';
      break;
    case '/rewards/create':
      pageName = 'campaigns';
      filterName = 'create';
      break;
    case '/rewards/manage':
      pageName = 'campaigns';
      filterName = 'manage';
      break;
    case '/rewards/payables':
      pageName = 'campaigns';
      filterName = 'payables';
      break;
    case '/rewards/match-bot':
      pageName = 'campaigns';
      filterName = 'match_bot';
      break;
    case '/rewards/id':
      pageName = 'campaigns';
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
