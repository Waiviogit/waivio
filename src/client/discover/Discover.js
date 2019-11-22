import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Modal } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import SidenavDiscoverObjects from '../discoverObjects/SidenavDiscoverObjects';
import './Discover.less';

const Discover = ({ intl }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="shifted">
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'discover_more_people',
            defaultMessage: 'discover_more_people',
          })}{' '}
          - Waivio
        </title>
      </Helmet>
      <div className="feed-layout container">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className="Objects">
          <div className="discover-objects-header">
            <div className="flex justify-between">
              <span className="discover-objects-header__title">
                <span className="discover-objects-header__topic ttc">
                  <FormattedMessage id="users" defaultMessage="Users" />
                </span>
                <span className="ttc">: All</span>&nbsp;
                <span className="discover-objects-header__selector">
                  (
                  <span
                    className="underline"
                    role="presentation"
                    onClick={() => setShowModal(true)}
                  >
                    <FormattedMessage id="change" defaultMessage="change" />
                  </span>
                  )
                </span>
              </span>
            </div>
          </div>
          <Modal
            className="discover-filters-modal"
            footer={null}
            title="title"
            closable
            visible={showModal}
            onCancel={() => setShowModal(false)}
          >
            <SidenavDiscoverObjects withTitle={false} />
          </Modal>
          <div className="Discover__title">
            <h1>
              <FormattedMessage id="discover_more_people" defaultMessage="Discover more people" />
            </h1>
            <FormattedMessage
              id="discover_more_people_info"
              defaultMessage="Discover the most reputable users of this platform"
            />
          </div>
          <div className="Objects__content">
            <DiscoverContent />
          </div>
        </div>
      </div>
    </div>
  );
};

Discover.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Discover);
