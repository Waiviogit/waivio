import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, mapKeys } from 'lodash';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import './MobileNavigation.less';

const MobileNavigation = ({ match, formatMessage }) => {
  const [isModalOpen, setModalVisibility] = useState(false);
  useEffect(() => {
    setModalVisibility(false);
  }, [match]);

  const config = {
    typeName: 'object',
    filterKey: 'rewards',
    sortBy: 'steem',
  };

  let pageName;
  let filterName;

  mapKeys(config, (value, key) => {
    if (!isEmpty(match.params[key])) {
      pageName = value;
      filterName = match.params[key];
    }
  });

  if (!pageName || !filterName) {
    switch (match.url) {
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
      default:
        pageName = 'personal';
        filterName = 'my_feed';
        break;
    }
  }

  const title = formatMessage({ id: `mobnav_${filterName}`, defaultMessage: 'Default' });

  return (
    <React.Fragment>
      <span className="discover-objects-header__title">
        <span className="discover-objects-header__topic ttc">
          {formatMessage({ id: `mobnav_${pageName}`, defaultMessage: 'Personal' })}:&nbsp;
        </span>
        <span className="ttc">{title !== 'Default' ? title : filterName}</span>&nbsp;
        <span className="discover-objects-header__selector">
          (
          <span className="underline" role="presentation" onClick={() => setModalVisibility(true)}>
            {formatMessage({ id: 'change', defaultMessage: 'change' })}
          </span>
          )
        </span>
      </span>
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
  formatMessage: PropTypes.func.isRequired,
};

export default MobileNavigation;
