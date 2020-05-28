import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useDispatch } from 'react-redux';
import { Tag } from 'antd';

import { injectIntl, FormattedMessage } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import { resetSearchUsersForDiscoverPage } from '../search/searchActions';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';

import './Discover.less';

const Discover = ({ intl, match, history, isMobileNavMenuOpen, toggleMobileNavMenu }) => {
  const dispatch = useDispatch();
  const handleDeleteTag = () => {
    history.push('/discover');
    dispatch(resetSearchUsersForDiscoverPage());
  };

  return (
    <div className="shifted">
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'discover_more_people',
            defaultMessage: 'discover_more_people',
          })}{' '}
          - InvestArena
        </title>
      </Helmet>
      <div className="feed-layout container">
        <Affix className="leftContainer" stickPosition={116}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className="Discover">
          <MobileNavigation
            toggleMobileNavMenu={toggleMobileNavMenu}
            isMobileNavMenuOpen={isMobileNavMenuOpen}
          />
          <div className="Discover__title">
            <h1>
              <FormattedMessage id="discover_more_people" defaultMessage="Discover more people" />
            </h1>
            <FormattedMessage
              id="discover_more_people_info"
              defaultMessage="Discover the most reputable users of this platform"
            />
          </div>
          {match.params.search && (
            <div className="Objects__tags">
              <Tag closable onClose={handleDeleteTag}>
                {match.params.search}
              </Tag>
            </div>
          )}
          <div className="Discover__content">
            <DiscoverContent searchString={match.params.search} />
          </div>
        </div>
      </div>
    </div>
  );
};

Discover.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      search: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape().isRequired,
  isMobileNavMenuOpen: PropTypes.bool.isRequired,
  toggleMobileNavMenu: PropTypes.func.isRequired,
};

export default injectIntl(Discover);
