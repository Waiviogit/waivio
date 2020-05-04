import React, { useEffect } from 'react';
import { Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MobileNavigation.less';
import HomeBar from './MobilePerformens/HomeBar';

const MobileNavigation = ({ match, toggleMobileNavMenu, isMobileNavMenuOpen }) => {
  useEffect(() => {}, [match]);

  const pages = {
    discoverObjects: {
      regExp: /(^\/discover-objects)\/?(.*)/,
      id: 'objects',
    },
  };

  let pageName = '';
  let pageId = '';

  const { url } = match;
  switch (url) {
    case '/my_feed':
      pageName = 'My feed';
      pageId = 'my_feed';
      break;
    case (url.match(pages.discoverObjects.regExp) || {}).input:
      pageName = 'Discover';
      pageId = 'discover';
      break;
    case '/':
      pageName = 'Home';
      pageId = 'home';
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
            <HomeBar />
          </div>
          <div
            className="MobileLeftSidebar__mask"
            onClick={toggleMobileNavMenu}
            role="presentation"
          />
        </div>
      )}
      <div className="discover-objects-header">
        <span className="discover-objects-header__title">
          {pageName && (
            <span
              className="discover-objects-header__topic ttc"
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
