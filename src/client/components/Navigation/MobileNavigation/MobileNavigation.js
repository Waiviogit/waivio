import React from 'react';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MobileNavigation.less';
import HomeBar from './MobilePerformens/HomeBar/HomeBar';
import TopInstruments from '../../../app/Sidebar/TopInstruments';
import SidenavDiscoverObjects from '../../../discoverObjects/SidenavDiscoverObjects';

const MobileNavigation = ({ match, toggleMobileNavMenu, isMobileNavMenuOpen }) => {
  const pages = {
    discoverObjects: {
      regExp: /(^\/discover-objects)\/?(.*)/,
      id: 'objects',
    },
  };

  let pageName = '';
  let pageId = '';
  let pageContent = null;

  const { url } = match;
  switch (url) {
    case '/my_feed':
      pageName = 'My feed';
      pageId = 'my_feed';
      pageContent = <TopInstruments isMobile />;
      break;
    case (url.match(pages.discoverObjects.regExp) || {}).input:
      pageName = 'Discover';
      pageId = 'discover';
      pageContent = <SidenavDiscoverObjects withTitle={false} />;
      break;
    case '/':
      pageName = 'Home';
      pageId = 'home';
      pageContent = <HomeBar />;
      break;
    default:
      break;
  }

  const getHeaderTitle = () => {
    switch (url) {
      case '/my_feed':
        return <FormattedMessage id="mobnav_my_feed" defaultMessage="My feed" />;
      case (url.match(pages.discoverObjects.regExp) || {}).input:
        return <FormattedMessage id="mobnav_discover" defaultMessage="Discover" />;
      case '/':
      default:
        return <FormattedMessage id="mobnav_home" defaultMessage="Home" />;
    }
  };

  return (
    <React.Fragment>
      {isMobileNavMenuOpen && (
        <div className="MobileLeftSidebar">
          <div className="MobileLeftSidebar__wrapper">
            <div className="header">
              {getHeaderTitle()}
              <Icon type="caret-left" style={{ color: '#f2f2f2' }} onClick={toggleMobileNavMenu} />
            </div>
            {pageContent}
          </div>
          <div
            className="MobileLeftSidebar__mask"
            onClick={toggleMobileNavMenu}
            role="presentation"
          />
        </div>
      )}
      <div className="NavigationMenu">
        <span className="NavigationMenu__title">
          {pageName && (
            <span
              className="NavigationMenu__topic ttc"
              role="presentation"
              onClick={toggleMobileNavMenu}
            >
              <FormattedMessage id={`mobnav_${pageId}`} defaultMessage={pageName} />
              &nbsp;
              <Icon type="caret-right" style={{ color: '#2088ff' }} />
            </span>
          )}
        </span>
      </div>

      {/* <Modal */}
      {/*  className="discover-filters-modal" */}
      {/*  footer={null} */}
      {/*  title={pageName.toUpperCase()} */}
      {/*  closable */}
      {/*  visible={isModalOpen} */}
      {/*  onCancel={() => setModalVisibility(false)} */}
      {/* > */}
      {/*  <LeftSidebar/> */}
      {/* </Modal> */}
    </React.Fragment>
  );
};

MobileNavigation.propTypes = {
  location: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  isMobileNavMenuOpen: PropTypes.bool.isRequired,
  toggleMobileNavMenu: PropTypes.func.isRequired,
};

export default withRouter(MobileNavigation);
