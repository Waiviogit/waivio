import React, { useState, useEffect } from 'react';
import { Icon, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isEmpty, mapKeys } from 'lodash';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import './MobileNavigation.less';

const MobileNavigation = ({ match }) => {
  const [isModalOpen, setModalVisibility] = useState(false);
  useEffect(() => {
    setModalVisibility(false);
  }, [match]);

  const config = {
    typeName: 'object',
    filterKey: 'rewards',
    sortBy: 'steem',
    0: 'edit',
  };

  let pageName;
  let filterName;

  mapKeys(config, (value, key) => {
    if (!isEmpty(match.params[key])) {
      pageName = value;
      filterName = match.params[key];
    }
  });

  pageName = pageName === 0 ? 'Campaigns' : pageName;

  if (!pageName || !filterName || filterName === 'active') {
    switch (match.url) {
      case '/discover':
        pageName = 'users';
        filterName = 'all';
        break;
      case '/discover-objects':
        pageName = 'objects';
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
      case '/notifications':
        pageName = 'personal';
        filterName = 'notifications';
        break;
      default:
        pageName = 'personal';
        filterName = 'my_feed';
        break;
    }
  }

  const title = <FormattedMessage id={`mobnav_${filterName}`} defaultMessage={filterName} />;

  return (
    <React.Fragment>
      <div className="discover-objects-header">
        <span className="discover-objects-header__title">
          <span className="discover-objects-header__topic ttc">
            <FormattedMessage id={`mobnav_${pageName}`} defaultMessage={pageName} />
            &nbsp; &gt; &nbsp;
          </span>
          <span
            className="discover-objects-header__selector"
            role="presentation"
            onClick={() => setModalVisibility(true)}
          >
            {title}
            <Icon type="caret-down" style={{ color: '#f87007' }} />
          </span>
          &nbsp;
        </span>
      </div>

      <Modal
        className="discover-filters-modal"
        footer={null}
        title={pageName.toUpperCase()}
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
  match: PropTypes.shape().isRequired,
};

export default withRouter(MobileNavigation);
